
import React from "react";
import { Loader2, ArrowLeft, Beaker, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const LoadingState: React.FC = () => {
  return (
    <div className="w-full">
      {/* Header placeholder - imita o cabeçalho real de BillingPageContent */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-2" disabled>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Cobrança</h1>
            <p className="text-muted-foreground">Gerenciamento de créditos e compras</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            disabled
          >
            <History size={16} />
            <span>Histórico de Cobrança</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            disabled
            className="flex items-center gap-1"
          >
            <Beaker size={16} />
            <span>Ferramentas de Dev</span>
          </Button>
        </div>
      </div>

      {/* Cartão principal - imita o conteúdo de cobrança */}
      <Card className="max-w-6xl p-6">
        <div className="flex flex-col items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-xl font-semibold mb-2">Carregando informações de pagamento</h1>
          <p className="text-muted-foreground text-sm">Aguarde enquanto carregamos suas opções de crédito...</p>
        </div>

        {/* Imitação do conteúdo de planos/pacotes */}
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoadingState;
