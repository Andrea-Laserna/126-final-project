async function fetchData(){
    try{
        const response = await fetch('https://api.kanye.rest');

        if(!response.ok){
            throw new Error("could not fetch resource"); 
        }

        const data = await response.json();
        const quote = data.quote;

        const container = document.getElementById("quote");
        container.textContent = `"${quote}" - Kanye West`;

    }catch(error){
        console.error("Error fetching quote:",error);
        document.getElementById("quote").textContent = "Could not load quote.";  
    }
}

window.addEventListener('DOMContentLoaded',fetchData); 