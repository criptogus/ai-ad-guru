
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, Coins } from "lucide-react";
import { motion } from "framer-motion";

interface WelcomeCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

const WelcomeCreditsModal: React.FC<WelcomeCreditsModalProps> = ({
  open,
  onOpenChange,
  onContinue,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <Gift className="h-10 w-10 text-primary" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </div>
          <DialogTitle className="text-xl text-center">
            Welcome to Lovable!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            You've received <strong>20 free credits</strong> to get started with
            our AI-powered ad creation platform.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 flex flex-col items-center space-y-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center justify-center bg-primary/5 p-6 rounded-lg w-full"
          >
            <Coins className="h-8 w-8 text-amber-500 mr-4" />
            <span className="text-2xl font-bold">20 Credits</span>
          </motion.div>

          <div className="space-y-2 text-center">
            <h3 className="font-medium">What you can do with your credits:</h3>
            <ul className="text-sm space-y-1 text-left">
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex items-center"
              >
                <span className="text-green-500 mr-2">✓</span> Create AI-generated text ads (1 credit per ad)
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="flex items-center"
              >
                <span className="text-green-500 mr-2">✓</span> Generate image ads with AI (3 credits per image)
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="flex items-center"
              >
                <span className="text-green-500 mr-2">✓</span> Analyze websites and audiences (5 credits)
              </motion.li>
              <motion.li
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="flex items-center"
              >
                <span className="text-green-500 mr-2">✓</span> Optimize campaigns automatically (2 credits per cycle)
              </motion.li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex justify-center">
          <Button onClick={onContinue} size="lg">
            Start Creating Ads
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeCreditsModal;
