import { persisted } from 'svelte-local-storage-store'

export const api_key_preferences = persisted('api_key_preferences', { 
    use: 'non_commercial', 
    apikey: '', 
    self_host_server: 'https://my-server.tld' 
});

export const theme = persisted('theme', false);