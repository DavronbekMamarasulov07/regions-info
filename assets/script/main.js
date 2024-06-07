const $regionSelect = document.querySelector("#region-select");
const $regionBox = document.querySelector("#info");
const $regionBorderBox = document.querySelector("#region-border-box")
const $regionForm = document.querySelector(".box-region-happyday")
const $regionInput = document.querySelector("#region-input")
const $result = document.querySelector("#result")

const renderRegion = (data) => {
    const $regionsFragment = document.createDocumentFragment();
    data.forEach(item => {
        const $option = document.createElement("option")
        $option.innerText = item.name
        $option.value = item.countryCode
        $regionsFragment.appendChild($option);
    });

    $regionSelect.appendChild($regionsFragment)
}

const loadAllRegions = () => {
    fetch("https://date.nager.at/api/v3/AvailableCountries")
        .then(res => res.json())
        .then(data => renderRegion(data))
}

loadAllRegions();

const renderRegionInfo = (data) => {
    $regionBox.innerHTML = `
        <h1>Region Name: <span>${data.commonName}</span></h1>
        <p>Official Name: <span>${data.officialName}</span></p>
        <p>Country Code: <span>${data.countryCode}</span></p>
        <p>Region: <span>${data.region}</span></p>
    `;

    if (data.borders.length === 0) {
        $regionBorderBox.innerHTML = `<strong class="region-title">No Borders Found for ${data.commonName}</strong>`;
    } else {
        $regionBorderBox.innerHTML = `<strong class="region-title">Borders of ${data.commonName}:</strong>`;
        data.borders.forEach(item => {
            $regionBorderBox.innerHTML += `
                <div class="border-items">
                    <h3>Region Name: <span>${item.commonName}</span></h3>
                    <p>Official Name: <span>${item.officialName}</span></p>
                    <p>Country Code: <span>${item.countryCode}</span></p>
                    <p>Region: <span>${item.region}</span></p>
                </div>
            `;
        });
    }


    const holidayInfo = (e) => {
        e.preventDefault()
        
        fetch(`https://date.nager.at/api/v3/PublicHolidays/${$regionInput.value}/${data.countryCode}`)
            .then(res => res.json())
            .then(data => {
                $result.innerHTML = ""
                if (data.length === 0) {
                    $result.innerHTML = "<div class='holiday-info-alert'>No holiday</div>"
                } else {
                    data.forEach((item) => {
                        console.log(item);
                        $result.innerHTML +=`
                            <div class="holiday-info-item">
                                <h3>Holiday data: <span>${item.date}</span></h3>
                                <p>Holiday place: <span>${item.localName}</span></p>
                                <p>Holiday name: <span>${item.name}</span></p>
                            </div>
                        `
                    })
                }
            })
            .catch(err => {
                console.error(err)
                $result.innerHTML = "<div class='holiday-info-alert'>No holiday</div>"
            })
    }
    

    $regionForm.addEventListener("submit", holidayInfo)
}

const selectedRegion = (e) => {
    fetch(`https://date.nager.at/api/v3/CountryInfo/${e.target.value}`)
        .then(res => res.json())
        .then(data => renderRegionInfo(data))
        .catch(err => console.error(err));
}

$regionSelect.addEventListener("change", selectedRegion);
