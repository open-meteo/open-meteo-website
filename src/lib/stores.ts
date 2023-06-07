import { persisted } from 'svelte-local-storage-store'

export const api_key_preferences = persisted('api_key_preferences', { 
    use: 'non_commercial', 
    apikey: '', 
    self_host_server: 'http://127.0.0.1:8080' 
});