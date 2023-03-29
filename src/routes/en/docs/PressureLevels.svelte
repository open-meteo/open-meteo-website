<script lang="ts">
    export let pressureVariables = [
        {name: "temperature", label: "Temperature"},
        {name: "relativehumidity", label: "Relative Humidity"},
        {name: "cloudcover", label: "Cloudcover"},
        {name: "windspeed", label: "Wind Speed"},
        {name: "winddirection", label: "Wind Direction"},
        {name: "geopotential_height", label: "Geopotential Height"}
    ]
    export let levels = [30, 50, 70, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950, 975, 1000].reverse()
    
    function sliceIntoChunks<T>(arr: Array<T>, chunkSize: number): Array<Array<T>> {
        const res = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize);
            res.push(chunk);
        }
        return res;
    }
    
    function altitudeAboveSeaLevelMeters(pressureLevelHpA: number): string {
        let altitude = -1/2.25577 * 10e4 * (Math.pow(pressureLevelHpA/1013.25, 1/5.25588) - 1)
        if (altitude <= 500) {
            return `${Math.round(altitude/10)*10} m`
        }
        if (altitude <= 2000) {
            return `${Math.round(altitude/100)*100} m`
        }
        if (altitude <= 20000) {
            return `${Math.round(altitude/100)/10} km`
        }
        return `${Math.round(altitude/1000)} km`
    }
</script>
    


<div class="accordion-item">
    <h2 class="accordion-header" id="heading-pressure-levels">
        <button class="accordion-button collapsed py-2" type="button" data-bs-toggle="collapse"
        data-bs-target="#collapse-pressure-levels" aria-expanded="false" aria-controls="collapse-pressure-levels">
        Pressure Levels&nbsp;<span class="badge rounded-pill bg-secondary checkboxcounter"
            data-count-checkboxes-of="#collapse-pressure-levels">0/x</span>&nbsp;<span
            class="badge bg-primary">New</span>
        </button>
    </h2>
    <div id="collapse-pressure-levels" class="accordion-collapse collapse"
        aria-labelledby="heading-pressure-levels" data-bs-parent="#accordionVariables">
        <div class="accordion-body">
        <div class="d-flex align-items-start">
            <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                {#each pressureVariables as variable, i}
                    <button class="nav-link text-start text-nowrap" class:active={i === 0}
                        id="v-pills-{variable.name}-tab" data-bs-toggle="pill" data-bs-target="#v-pills-{variable.name}"
                        type="button" role="tab" aria-controls="v-pills-{variable.name}"
                        aria-selected={i === 0}>{variable.label}</button>
                {/each}
            </div>
            <div class="tab-content" id="v-pills-tabContent">
                {#each pressureVariables as variable, i}
            <div class="tab-pane fade" class:active={i === 0} id="v-pills-{variable.name}"
                role="tabpanel" aria-labelledby="v-pills-{variable.name}-tab">
                <div class="row">
                    {#each sliceIntoChunks(levels, levels.length/3+1) as chunk}
                    <div class="col-lg-4">
                    {#each chunk as level}
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="{variable.name}_{level}hPa"
                        id="{variable.name}_{level}hPa" name="hourly">
                    <label class="form-check-label" for="{variable.name}_{level}hPa">
                        {level} hPa <small class="text-muted">({altitudeAboveSeaLevelMeters(level)})</small>
                    </label>
                    </div>
                    {/each}
                    </div>
                {/each}
                </div>
            </div>
            {/each}
            <div class="mt-3">
                <small class="text-muted">Note: Altitudes are approximate and in meters <strong> above sea
                    level</strong> (not above ground). Use <mark>geopotential_height</mark> to get precise
                altitudes above sea level.</small>
            </div>
            </div>
        </div>
        </div>
    </div>
</div>    