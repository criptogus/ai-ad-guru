import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { loginWithEmail, loginWithGoogle, logout } from '@/services/auth/loginService';

// Mock das dependências
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('loginService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  describe('loginWithEmail', () => {
    it('deve retornar sessão e usuário quando login for bem-sucedido', async () => {
      const mockUser = { id: '123', email: 'test@example.com' };
      const mockSession = { access_token: 'token123' };
      
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: mockUser,
          session: mockSession,
        },
        error: null,
      });
      
      const result = await loginWithEmail('test@example.com', 'password123');
      
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('deve retornar erro quando credenciais forem inválidas', async () => {
      const mockError = {
        message: 'Invalid login credentials',
      };
      
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });
      
      const result = await loginWithEmail('test@example.com', 'wrong-password');
      
      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('incorrect');
    });

    it('deve retornar erro personalizado quando email não estiver confirmado', async () => {
      const mockError = {
        message: 'Email not confirmed',
      };
      
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError,
      });
      
      const result = await loginWithEmail('test@example.com', 'password123');
      
      expect(result.user).toBeNull();
      expect(result.session).toBeNull();
      expect(result.error).toBeDefined();
      expect(result.error.message).toContain('confirmation link');
    });
  });

  describe('loginWithGoogle', () => {
    it('deve iniciar o fluxo de autenticação do Google corretamente', async () => {
      const mockData = { provider: 'google', url: 'https://oauth.url' };
      
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: mockData,
        error: null,
      });
      
      const result = await loginWithGoogle();
      
      expect(result).toEqual(mockData);
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: expect.any(String),
          queryParams: expect.objectContaining({
            access_type: 'offline',
            prompt: 'consent',
          }),
          scopes: 'email profile',
        }),
      });
    });

    it('deve lançar erro quando a autenticação do Google falhar', async () => {
      const mockError = {
        message: 'provider is not enabled',
      };
      
      const { supabase } = await import('@/integrations/supabase/client');
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: null,
        error: mockError,
      });
      
      await expect(loginWithGoogle()).rejects.toEqual(mockError);
    });
  });

  describe('logout', () => {
    it('deve chamar signOut e limpar localStorage', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      await logout();
      
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('session_expires_at');
    });
  });
});
