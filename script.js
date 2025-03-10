let c_name=document.getElementById('Search');

if(c_name){
    c_name.addEventListener('click',function(){
        let userInput=document.getElementById('country_name').value.trim();
        
        if(userInput){
            getCountryData(userInput);
        }
        else {
            try {
                throw new Error("Please enter the country name!");
            } catch (error) {
                alert(error.message); // Display as a popup alert
            }
        }
    });

    function getCountryData(c_name){
        fetch(`https://restcountries.com/v3.1/name/${c_name}`)
            .then(response =>{
                if(!response.ok){
                    throw new Error('Country not found');
                }
                return response.json();
            })
            .then(data=>{
                displayCountryInfo(data);
                displayNeighbouringCountries(data);
            })
            .catch(error =>{
                console.error('Error fetching data:',error);
                document.getElementById('country-info').innerHTML=`<p>Country not found</p>`;
                document.getElementById('bordering-countries').innerHTML= '';
            });
    }

    function displayCountryInfo(data){
        const resultDiv= document.getElementById('country-info');
        resultDiv.innerHTML= `
            <h2><i>${data[0].name.common}</i></h2>
            <p><b>Capital:</b> ${data[0].capital ? data[0].capital[0] : 'N/A'}</p>
            <p><b>Population:</b> ${data[0].population.toLocaleString()}</p>
            <p><b>Region:</b> ${data[0].region}</p>
            <p><b>Flag:</b></p>
            <img src="${data[0].flags.png}" alt="Flag of ${data[0].name.common}" width="500">
        `;
    }

    function displayNeighbouringCountries(data) {
        const resultDiv= document.getElementById('bordering-countries');
        const borders= data[0].borders;
        
        if (borders.length===0 || !borders) {
            resultDiv.innerHTML= `<p>No neighbouring countries.</p>`;
            return;
        }
        resultDiv.innerHTML=`<h4>Neighbouring Countries:</h4><ul></ul>`;
        const ul=resultDiv.querySelector('ul');

        borders.forEach(code =>{
            fetch(`https://restcountries.com/v3.1/alpha/${code}`)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const neighbour = data[0];
                    const li = document.createElement('li');
                    li.innerHTML = `
                        ${neighbour.name.common}
                        <section>
                            <img src="${neighbour.flags.png}" alt="Flag of ${neighbour.name.common}" width="300">
                        </section>
                    `;
                    ul.appendChild(li);
                })
        });
    }

}
