import React, { useEffect, useState } from 'react';
import { supabaseConnectionInfo } from '@/integrations/supabase/client';

interface DiagnosticStatus {
  supabaseVars: boolean;
  manifestLoaded: boolean;
  assetsLoaded: boolean;
}

const DiagnosticPage: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticStatus>({
    supabaseVars: false,
    manifestLoaded: true, // Assumimos que está carregado até que se prove o contrário
    assetsLoaded: false
  });
  
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  
  useEffect(() => {
    // Verificar variáveis do Supabase
    const supabaseVars = supabaseConnectionInfo.isConfigured;
    
    // Verificar se o manifest foi carregado corretamente
    // Se houver erro no console relacionado ao manifest, consideramos não carregado
    const manifestErrors = Array.from(document.querySelectorAll('head > link[rel="manifest"]'));
    const manifestLoaded = manifestErrors.length > 0;
    
    // Verificar se os assets principais foram carregados
    const assetsLoaded = document.styleSheets.length > 0;
    
    setDiagnostics({
      supabaseVars,
      manifestLoaded,
      assetsLoaded
    });
    
    // Após 10 segundos, escondemos o diagnóstico automaticamente se tudo estiver OK
    const timer = setTimeout(() => {
      if (supabaseVars && manifestLoaded && assetsLoaded) {
        setShowDiagnostics(false);
      }
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Se tudo estiver OK e o diagnóstico estiver oculto, não renderizamos nada
  if (!showDiagnostics && diagnostics.supabaseVars && diagnostics.manifestLoaded && diagnostics.assetsLoaded) {
    return null;
  }
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      padding: '15px', 
      backgroundColor: '#f8f9fa', 
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '400px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Diagnóstico da Aplicação</h3>
        <button 
          onClick={() => setShowDiagnostics(false)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px' 
          }}
        >
          ×
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ 
          padding: '8px 0', 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: '1px solid #eee'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            backgroundColor: diagnostics.supabaseVars ? '#4caf50' : '#f44336',
            marginRight: '10px'
          }}></span>
          <span>Variáveis Supabase: {diagnostics.supabaseVars ? 'Configuradas' : 'Não encontradas'}</span>
        </li>
        <li style={{ 
          padding: '8px 0', 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: '1px solid #eee'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            backgroundColor: diagnostics.manifestLoaded ? '#4caf50' : '#f44336',
            marginRight: '10px'
          }}></span>
          <span>Manifest.json: {diagnostics.manifestLoaded ? 'Carregado' : 'Erro'}</span>
        </li>
        <li style={{ 
          padding: '8px 0', 
          display: 'flex', 
          alignItems: 'center'
        }}>
          <span style={{ 
            display: 'inline-block', 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            backgroundColor: diagnostics.assetsLoaded ? '#4caf50' : '#f44336',
            marginRight: '10px'
          }}></span>
          <span>Assets CSS: {diagnostics.assetsLoaded ? 'Carregados' : 'Não carregados'}</span>
        </li>
      </ul>
      {(!diagnostics.supabaseVars || !diagnostics.manifestLoaded || !diagnostics.assetsLoaded) && (
        <div style={{ marginTop: '15px', fontSize: '14px', color: '#555' }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>Problemas detectados:</strong>
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            {!diagnostics.supabaseVars && (
              <li>Variáveis de ambiente do Supabase não configuradas no Netlify</li>
            )}
            {!diagnostics.manifestLoaded && (
              <li>Erro ao carregar o arquivo manifest.json</li>
            )}
            {!diagnostics.assetsLoaded && (
              <li>Falha ao carregar arquivos CSS e outros assets</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiagnosticPage;
