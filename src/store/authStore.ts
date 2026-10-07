import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface AuthState {

    url: string
    idInstance: string
    apiTokenInstance: string

    authorize: (url: string, idInstance: string, apiTokenInstance: string) => void;
    restore: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            url: '',
            idInstance: '',
            apiTokenInstance: '',

            authorize: async (url: string, idInstance: string, apiTokenInstance: string) => {
                set({ url: url, idInstance: idInstance, apiTokenInstance: apiTokenInstance });
            },

            restore: () => set({ url: '', idInstance: '', apiTokenInstance: '' }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ url: state.url, idInstance: state.idInstance, apiTokenInstance: state.apiTokenInstance }),
        }
    )
);

export const isAuthorized = (state: AuthState) => Boolean(state.idInstance && state.apiTokenInstance && state.url);