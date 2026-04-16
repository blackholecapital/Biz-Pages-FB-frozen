type WalletConnectButtonProps = {
  connected: boolean;
  onConnect: () => void;
};

export function WalletConnectButton({ connected, onConnect }: WalletConnectButtonProps) {
  return (
    <button type="button" className="loginTextBtn" onClick={onConnect} disabled={connected}>
      {connected ? "Wallet connected" : "Connect wallet"}
    </button>
  );
}
