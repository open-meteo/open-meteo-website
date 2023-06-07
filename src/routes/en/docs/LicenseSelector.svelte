<script lang="ts">
    import { api_key_preferences } from "$lib/stores"
    
</script>

<div class="row py-3 px-0">
    <h2>Usage License</h2>
    <div class="col-md-3">
        <div class="form-floating mb-3">
        <select class="form-select" name="use" id="use" aria-label="Use" data-default="non_commercial" bind:value={$api_key_preferences.use}>
            <option value="non_commercial" selected>Non-Commercial</option>
            <option value="commercial">Commercial</option>
            <option value="self_hosted">Self-Hosted</option>
        </select>
        <label for="use">Use</label>
        </div>
    </div>
    {#if $api_key_preferences.use == "non_commercial"}
    <div class="col-md-9">
        <div class=" alert alert-info" role="alert">Only for non-commercial use with less than 10.000 daily API calls. See <a href="/en/terms">Terms</a> for more details.</div>
    </div>
    {/if}
    {#if $api_key_preferences.use == "commercial"}
    <div class="col-md-3">
        <div class="form-floating">
        <input type="text" class="form-control" name="apikey" id="apikey" bind:value={$api_key_preferences.apikey} required>
        <label for="apikey">API Key</label>
        </div>
    </div>
    <div class="col-md-6">
        <div class="alert alert-info" role="alert">See <a href="/en/pricing">Pricing</a> for more details.</div>
    </div>
    {/if}
    {#if $api_key_preferences.use == "self_hosted"}
    <div class="col-md-3">
        <div class="form-floating">
        <input type="text" class="form-control" name="self_host_server" id="self_host_server" bind:value={$api_key_preferences.self_host_server}>
        <label for="self_host_server">Server URL</label>
        </div>
    </div>
    <div class="col-md-6">
        <div class="alert alert-info" role="alert">See <a href="https://github.com/open-meteo/open-meteo">GitHub</a> for more instructions. Make sure your node supports HTTPS.</div>
    </div>
    {/if}
</div>