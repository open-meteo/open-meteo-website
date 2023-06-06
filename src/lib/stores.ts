import { writable } from 'svelte/store';

export const preferences = writable({ 
    use: 'non_commercial', 
    apikey: '', 
    self_host_server: 'http://127.0.0.1:8080' 
});