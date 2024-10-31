let totalSpend = 0
let totalLiters = 0

const apiKey = "$2a$10$fb8QE7AY7HV94VRRixlo9eTLLLYf2vzNcfiFmE9VZ8GpVL02FYrk.";
const binId = "67236f79acd3cb34a8a01513";

const uploadBtn = document.getElementById('uploadBtn');
const priceInput = document.getElementById('priceInput');
const literInput = document.getElementById('literInput');
const historyView = document.querySelector('.historyView');

fetchData();

uploadBtn.addEventListener('click', async () => {
    let price = Number.parseFloat(priceInput.value);
    let liter = Number.parseFloat(literInput.value);

    if(!isNaN(liter) && !isNaN(price))
    {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const newData =  {
            date: formattedDate,
            liters: liter,
            price: price
        };
        await updateData(newData);
        await fetchData();
        priceInput.value = "";
        literInput.value = "";
    }
    else{
        console.log("test")
        alert("Invalid format. Only numbers above 0.1 are allowed");
    }   
});

function displayFuelHistory(data) {
    historyView.innerHTML = "";
    
    if (Array.isArray(data)) {
        data = data.filter(entry => entry.price != 0);
        data.forEach((entry) => {
            totalSpend += entry.price;
            totalLiters += entry.liters;

            const entryDiv = document.createElement("div");
             entryDiv.classList.add("historyEntry");

            const date = document.createElement("p");
            date.textContent = `Date: ${entry.date}`;
            date.classList.add("dateStyle");

            const liters = document.createElement("p");
            liters.textContent = `Liters: ${entry.liters}L`;
            liters.classList.add("litersStyle");

            const price = document.createElement("p");
            price.textContent = `Price: ${entry.price}€`;
            price.classList.add("priceStyle");

            entryDiv.appendChild(date);
            entryDiv.appendChild(liters);
            entryDiv.appendChild(price);

            historyView.appendChild(entryDiv);
        });
        document.getElementById("literText").textContent = "Liters: " + totalLiters + " L";
        document.getElementById("priceText").textContent = "Price " + totalSpend + " €";
    }
}

async function fetchData() {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: "GET",
            headers: {
                "X-Master-Key": apiKey,
                "Content-Type": "application/json"
            }
        });
        
        if (!response.ok) {
            throw new Error(`Fehler: ${response.statusText}`);
        }
        
        const data = await response.json();
        displayFuelHistory(data.record);
        
        return data;
    } catch (error) {
        console.error("Could not get Data:", error);
    }
}

async function updateData(newData) {
    try {
        const currentData = await fetchData();

        let updatedData;
        if (Array.isArray(currentData.record)) {
            updatedData = [...currentData.record, newData];
            console.log("It is an array")
        } else {
            updatedData = [currentData.record, newData];
        }

        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: "PUT",
            headers: {
                "X-Master-Key": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            throw new Error(`Fehler: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Could not update data:", error);
    }
}
