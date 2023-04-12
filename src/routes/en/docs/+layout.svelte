<script lang="ts">
import { page } from '$app/stores';
import { dev } from '$app/environment';

const links = [
  {title: "Weather Forecast API", urls: [
    {title: "Weather Forecast API", url: "/en/docs"},
    {title: "DWD API", url: "/en/docs/dwd-api"},
    {title: "GFS API", url: "/en/docs/gfs-api"},
    {title: "MeteoFrance API", url: "/en/docs/meteofrance-api"},
    {title: "ECMWF API", url: "/en/docs/ecmwf-api"},
    {title: "JMA API", url: "/en/docs/jma-api"},
    {title: "MET Nordic API", url: "/en/docs/metno-api"},
    {title: "GEM API", url: "/en/docs/gem-api"},
  ]},
  {title: "Historical Weather API", url: "/en/docs/historical-weather-api"},
  {title: "Marine Forecast API", url: "/en/docs/marine-weather-api"},
  {title: "Air Quality API", url: "/en/docs/air-quality-api"},
  {title: "Geocoding API", url: "/en/docs/geocoding-api"},
  {title: "Elevation API", url: "/en/docs/elevation-api"},
  {title: "Flood API", url: "/en/docs/flood-api"}
]
if (dev) {
  links.push({title: "Climate API", url: "/en/docs/climate-api"})
  links.push({title: "Seasonal Forecast API", url: "/en/docs/seasonal-forecast-api"})
}
</script>

<style>
.btn-toggle {
  padding: .25rem .5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, .65);
  background-color: transparent;
}
.btn-toggle:hover,
.btn-toggle:focus {
  color: rgba(0, 0, 0, .85);
  background-color: #d2e7f4;
}

.btn-toggle::after {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform .35s ease;
  transform-origin: .5em 50%;
}

.btn-toggle[aria-expanded="true"] {
  color: rgba(0, 0, 0, .85);
}
.btn-toggle[aria-expanded="true"]::after {
  transform: rotate(90deg);
}

/*.btn-toggle-nav a {
  padding: .1875rem .5rem;
  margin-top: .125rem;
  margin-left: 1.25rem;
}
.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  background-color: #d2e7f4;
}*/

.btn-hover:hover, .btn-hover.active {
    background-color: #d2e7f4;
}
</style>

<div class="px-4 py-5 text-center text-white" style="
            background-image: url('{$page.data.hero}');
            background-size: cover;
            background-position: center;
            height: 300px;
          ">
  <svg style="filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));" xmlns="http://www.w3.org/2000/svg" width="96"
    height="96" fill="currentColor" class="bi bi-gear-wide-connected mb-4" viewBox="0 0 16 16">
    <path
      d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434l.071-.286zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5zm0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78h4.723zM5.048 3.967c-.03.021-.058.043-.087.065l.087-.065zm-.431.355A4.984 4.984 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8 4.617 4.322zm.344 7.646.087.065-.087-.065z" />
  </svg>
  <h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">{$page.data.title}</h1>
  <div class="col-lg-6 mx-auto">
    <p class="lead mb-4" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">{$page.data.subtitle}.</p>
  </div>
</div>

<div class="container-fluid">
    <div class="row">
      <div class="m-4 d-md-none">
        <button class="btn btn-outline-dark dropdown-toggle collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-expanded="false" aria-controls="sidebarMenu">
          Available APIs
        </button>
      </div>
      <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse p-4">
        <ul class="list-unstyled">
          {#each links as link}
            {#if link.urls}
            {@const id = link.title.replace(/\s+/g, '-').toLowerCase()}
            <li>
              <div class="">
              <button class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapse" id="{id}-button" data-bs-toggle="collapse" data-bs-target="#{id}-collapse" aria-expanded="true">
                {link.title}
              </button></div>
              <div class="collapse show" id="{id}-collapse" style="" aria-labelledby="{id}-button">
                <ul class="list-unstyled ms-3 mb-4">
                  {#each link.urls as l}
                  <li class="py-1"><a href={l.url} class="btn-hover py-1 px-2 link-dark text-decoration-none rounded" class:active={$page.url.pathname === l.url}>{l.title}</a></li>
                  {/each}
                </ul>
              </div>
            </li>
            {:else}
              <li class="py-2"><a class="btn-hover link-dark text-decoration-none rounded px-2 py-2" href={link.url} class:active={$page.url.pathname === link.url}>{link.title}</a></li>
            {/if}
          {/each}
      </nav>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <slot />
      </main>
    </div>
  </div>
  

