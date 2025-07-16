import { useAccount } from 'wagmi';

export function WalletInfo() {
  const { address, isConnected } = useAccount();

  return (
    <div className="text-xs text-white break-all mt-2">
      {isConnected
        ? <>Connected wallet:<br />{address}</>
        : "Wallet not connected"}
    </div>
  );
}

