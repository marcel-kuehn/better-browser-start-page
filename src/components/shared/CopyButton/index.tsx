import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '../../ui/button';
import { useState } from 'react';
import type { CopyButtonProps } from './types';

export const CopyButton = ({ textToCopy, children }: CopyButtonProps) => {
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
