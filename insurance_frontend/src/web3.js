import Web3 from 'web3';

const RPC_URL = import.meta.env.VITE_RPC_URL;
const CHAIN_ID = Number.parseInt(import.meta.env.VITE_CHAIN_ID, 10);
const CHAIN_NAME = import.meta.env.VITE_CHAIN_NAME || 'Custom Chain';
const CURRENCY_NAME = import.meta.env.VITE_CURRENCY_NAME || 'ETH';
const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || 'ETH';
const CURRENCY_DECIMALS = Number.parseInt(import.meta.env.VITE_CURRENCY_DECIMALS || '18', 10);

let web3;

/**
 * Get a Web3 instance.
 * - If MetaMask is present, attempts to switch/add to the chain from .env.
 * - If requireAccount=true, will also request accounts and throw if user denies.
 * - If MetaMask not present or user denies but requireAccount=false, falls back to HttpProvider (read-only).
 *
 * @param {{requireAccount?: boolean}} opts
 */
export async function getWeb3(opts = { requireAccount: true }) {
  const { requireAccount } = opts;

  // reuse if already created
  if (web3) return web3;

  const desiredChainHex = CHAIN_ID ? '0x' + CHAIN_ID.toString(16) : null;
  const rpc = RPC_URL || (desiredChainHex ? undefined : undefined);

  // If injected provider exists, prefer it (allows sending txs)
  if (typeof window !== 'undefined' && window.ethereum) {
    const injected = window.ethereum;
    web3 = new Web3(injected);

    try {
      // If chain id is configured, try to switch the user's wallet to it
      if (desiredChainHex) {
        const currentChainHex = await injected.request({ method: 'eth_chainId' }).catch(() => null);
        if (currentChainHex !== desiredChainHex) {
          try {
            await injected.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: desiredChainHex }]
            });
          } catch (switchError) {
            // If the chain is not added to wallet, attempt to add it
            if (switchError && switchError.code === 4902) {
              const addParams = {
                chainId: desiredChainHex,
                chainName: CHAIN_NAME,
                nativeCurrency: {
                  name: CURRENCY_NAME,
                  symbol: CURRENCY_SYMBOL,
                  decimals: CURRENCY_DECIMALS
                },
                rpcUrls: RPC_URL ? [RPC_URL] : [],
                blockExplorerUrls: []
              };
              await injected.request({
                method: 'wallet_addEthereumChain',
                params: [addParams]
              });
            } else {
              // If user refuses to switch networks and requireAccount is true, throw.
              if (requireAccount) throw switchError;
            }
          }
        }
      }

      // request accounts only if required (txs)
      if (requireAccount) {
        await injected.request({ method: 'eth_requestAccounts' });
      }

      return web3;
    } catch (err) {
      // If user denied account access or network change and requireAccount is true, bubble up
      if (requireAccount) {
        throw new Error('User denied wallet connection or network change: ' + (err.message || err));
      }
      // else, fall through to create an HTTP provider below for read-only operations
    }
  }

  // Fallback to HTTP provider (read-only). Useful for calls that don't require accounts.
  if (!RPC_URL) {
    throw new Error('No RPC_URL configured in .env and no MetaMask available');
  }
  web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

  // If caller required an account and we only have HTTP provider, throw to indicate txs are not possible.
  if (requireAccount) {
    throw new Error('MetaMask not available or account access denied — cannot perform transactions. Connected in read-only mode.');
  }

  return web3;
}

/* ---------- Contract helpers ---------- */

/**
 * Mint a new policy NFT — requires an unlocked/injected wallet.
 * Matches your Solidity signature:
 *   mintPolicyNFT(string farmerId, string cropType, uint256 coverageAmount, uint256 premium, uint256 expirationDate)
 */
export async function mintPolicyNFT(
  contractAbi,
  contractAddress,
  account,
  { farmerId, cropType, coverageAmount, premium, expirationDate }
) {
  if (!contractAddress) throw new Error('Contract address is required');
  const w3 = await getWeb3({ requireAccount: true }); // require account for tx
  const contract = new w3.eth.Contract(contractAbi, contractAddress);

  // ensure expirationDate is a uint (seconds)
  const expiration = Number(expirationDate);
  return contract.methods
    .mintPolicyNFT(farmerId, cropType, Number(coverageAmount), Number(premium), expiration)
    .send({ from: account });
}

/**
 * Claim an existing policy — requires owner account.
 */
export async function claimPolicy(contractAbi, contractAddress, account, tokenId) {
  if (!contractAddress) throw new Error('Contract address is required');
  const w3 = await getWeb3({ requireAccount: true });
  const contract = new w3.eth.Contract(contractAbi, contractAddress);

  return contract.methods.claimPolicy(Number(tokenId)).send({ from: account });
}

/**
 * Fetch policy details from the blockchain — read-only, so do not require account.
 */
export async function getPolicyDetails(contractAbi, contractAddress, tokenId) {
  if (!contractAddress) throw new Error('Contract address is required');
  const w3 = await getWeb3({ requireAccount: false }); // read-only allowed via RPC_URL
  const contract = new w3.eth.Contract(contractAbi, contractAddress);

  return contract.methods.getPolicyDetails(Number(tokenId)).call();
}
