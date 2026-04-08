import { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminLoginModal({ open, onClose, onSuccess }: AdminLoginModalProps) {
  const { login } = useAdmin();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(code.trim())) {
      toast.success("Admin access granted!");
      setCode("");
      onSuccess();
    } else {
      toast.error("Invalid access code.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            System Access
          </DialogTitle>
          <DialogDescription>
            Enter the admin access code to continue.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <Button type="submit" className="w-full gradient-ocean text-primary-foreground border-0">
            Authenticate
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
