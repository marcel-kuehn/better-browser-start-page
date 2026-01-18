import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';

export const CopyButton = ({
  textToCopy,
  children,
}: {
  textToCopy: string;
  children: React.ReactNode;
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Button onClick={copyToClipboard} variant="outline">
      {hasCopied ? <CheckIcon /> : <CopyIcon />}
      {children}
    </Button>
  );
};
