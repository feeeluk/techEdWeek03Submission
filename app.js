// Constants and global variables
// ******************************************************************************************************************
// ******************************************************************************************************************
    const htmlResetButton = document.getElementById("resetButton");
    const htmlDeleteLocalStorageButton = document.getElementById("deleteLocalStorageButton");
    const htmlChangeBackgroundForm = document.getElementById("changeBackgroundFormId");
    const htmlBakeryName = document.getElementById("bakeryNameId");
    const htmlSaveBakeryName = document.getElementById("saveBakeryNameId");
    const htmlNumberOfCookies = document.getElementById("numberOfCookies");
    const htmlCookiesPerSecond = document.getElementById("cookiesPerSecond");
    const htmlClock = document.getElementById("clock");
    const htmlAPICheckBox = document.getElementById("apiCheckboxId");

    let counter = 0;
    let numberOfCookies = 0;
    let cookiesPerSecond = 0;
    let clickValue = 1;
    let purchasedUpgrades = [];
    let dataFromAPI = [];
    let dataFromLocal = [];
    let dataArray = [];
    let API = true;

// Initial load (functions that run straightaway)
//***********************************************************************************************************
// **********************************************************************************************************
    runFromAPI();
    clockSlow();
    loadNumberOfCookies();
    loadBakeryName();

    async function runFromAPI(){
        dataFromAPI = await fetchDataAPI();
        
        dataArray = dataFromAPI;
        loadLocalData();
        isDataFromAPI();
        clockFast();
        createDynamicData();
        createDynamicUI();
        createEventListeners();
    }

// Data from local array of objects
// ******************************************************************************************************************
// ******************************************************************************************************************
function makeLocalData(){

    let local = [
        {
            "id":   1,
            "name": "Counter",
            "cost": 10,
            "increase": 1,
            "url": "https://orteil.dashnet.org/cookieclicker/img/pointGlow.gif"
        },
        {
            "id":   2,
            "name": "Grandma",
            "cost": 100,
            "increase": 5,
            "url": "https://orteil.dashnet.org/cookieclicker/img/grandma.png"
        },
        {
            "id":   3,
            "name": "Farm",
            "cost": 1000,
            "increase": 10,
            "url": "https://orteil.dashnet.org/cookieclicker/img/farm.png"
        },
        {
            "id": 4,
            "name": "Mine",
            "cost": 2000,
            "increase": 20,
            "url": "https://orteil.dashnet.org/cookieclicker/img/mine.png"
        },
        {
            "id": 5,
            "name": "Factory",
            "cost": 5000,
            "increase": 50,
            "url": "https://orteil.dashnet.org/cookieclicker/img/factory.png"
        },
        {
            "id": 6,
            "name": "Bank",
            "cost": 10000,
            "increase": 100,
            "url": "https://orteil.dashnet.org/cookieclicker/img/bank.png"
        },
        {
            "id": 7,
            "name": "Temple",
            "cost": 20000,
            "increase": 200,
            "url": "https://orteil.dashnet.org/cookieclicker/img/temple.png"
        },
        {
            "id": 8,
            "name": "Wizard Tower",
            "cost": 50000,
            "increase": 500,
            "url": "https://orteil.dashnet.org/cookieclicker/img/wizardtower.png"
        },
        {
            "id": 9,
            "name": "Shipment",
            "cost": 100000,
            "increase": 1000,
            "url": "https://orteil.dashnet.org/cookieclicker/img/shipment.png"
        },
        {
            "id": 10,
            "name": "Alchemy lab",
            "cost": 200000,
            "increase": 2000,
            "url": "https://orteil.dashnet.org/cookieclicker/img/alchemylab.png"
        }
    ]

    return local;
}

function loadLocalData(){
    dataFromLocal = makeLocalData();
}

// Data from API
// ******************************************************************************************************************
// ******************************************************************************************************************
async function fetchDataAPI(){

    let response = await fetch("https://cookie-upgrade-api.vercel.app/api/upgrades");
    let json = await response.json();
    return json;
}

//Clock (slow / main)
// ******************************************************************************************************************
// ******************************************************************************************************************
    function clockSlow(){
        
        showClockInitialValue();

        setInterval(function(){
        
            counter++;

            totalSeconds = counter;
            totalMinutes = totalSeconds / 60;
            totalHours = totalMinutes / 60;

            seconds = (totalSeconds % 60);
            
            if(seconds < 10)
            {    
                seconds = "0" + seconds;
            }

            
            minutes = Math.floor(totalMinutes % 60);
            
            if(minutes < 10)
            {
                minutes = "0" + minutes;
            }

            hours = Math.floor(totalHours % 60);

            if(hours < 10)
            {
                hours = "0" + hours;
            }

            htmlClock.innerText = `${hours} : ${minutes} : ${seconds}`;
            saveNumberOfCookies();
            incrementCookies();

        }, 1000);
    }

    function showClockInitialValue(){
        htmlClock.innerText = `00 : 00 : 00`;
    }

    function incrementCookies(){
        numberOfCookies = numberOfCookies + cookiesPerSecond;
    }

// Clock (fast / program)
// ******************************************************************************************************************
// ******************************************************************************************************************
    function clockFast(){
        setInterval(function(){
            
            updateUI();
            checkIfUpgradesAreAvailable();

        }, 50)
    }

    function checkIfUpgradesAreAvailable(){

        for(let i = 0; i < dataArray.length; i++){

            if(numberOfCookies >= dataArray[i].cost){
                document.getElementById("b" + dataArray[i].name).disabled = false;
            } else {
                document.getElementById("b" + dataArray[i].name).disabled = true;
            }
        }
    }     

// Create Dynamic Data
// ******************************************************************************************************************
// ******************************************************************************************************************
    function createDynamicData(){
        createPurchasedUpgradesArray();       
    }

    function createPurchasedUpgradesArray(){

        purchasedUpgrades = [];

        for(let i = 0; i < dataArray.length; i++){
            let newObject = {"name": dataArray[i].name, "value": 0};
            purchasedUpgrades.push(newObject);
        }
    }

// Create Dynamic UI
// ******************************************************************************************************************
// ******************************************************************************************************************
    function createDynamicUI(){
        showAllUpgradeOptions();
        createUpgradePurchaseCounters()
    }

    function showAllUpgradeOptions(){

        document.getElementById("upgrades").innerText = '';

        for(let i = 0; i < dataArray.length; i++){

            let newP = document.createElement("p");
            newP.setAttribute("id", "p" + dataArray[i].name);

            let newButton = document.createElement("button");
            newButton.setAttribute("id", "b" + dataArray[i].name);
            newButton.setAttribute("class", "upgradeButton");
            newButton.setAttribute("type", "button");
            newButton.setAttribute("disabled", "disabled");
            newButton.innerText = dataArray[i].name;
        
            document.getElementById("upgrades").appendChild(newP);
            document.getElementById("p" + dataArray[i].name).innerText = "";
            document.getElementById("p" + dataArray[i].name).appendChild(newButton);
            
            let listenForUpgradePurchase = document.getElementById("b" + dataArray[i].name).addEventListener("click", function(){
                if(numberOfCookies > 0 && numberOfCookies >= dataArray[i].cost){
                    purchaseUpgrade(dataArray[i].name, dataArray[i].cost , dataArray[i].increase);
                }
            })

            let listenForUpgradeMouseover = document.getElementById("b" + dataArray[i].name).addEventListener("mouseover", function(){
                let box = document.getElementById("upgradeDetailsBoxId");
                box.style.visibility = "visible";
                box.innerText = `NAME: ${dataArray[i].name}, COST: ${dataArray[i].cost} x cookies, INCREMENT: ${dataArray[i].increase} cookies per second` ;
                if(API == false){
                    boxImg = document.createElement("img");
                    boxImg.src = dataArray[i].url;
                    box.appendChild(boxImg);
                }
            })

            let listenForUpgradeMouseout = document.getElementById("b" + dataArray[i].name).addEventListener("mouseout", function(){
                document.getElementById("upgradeDetailsBoxId").style.visibility = "hidden";
            })
        }       
    }

    function createUpgradePurchaseCounters(){

        document.getElementById("cookieDetailsSection").innerText = '';

        for(let i = 0; i < dataArray.length; i++){
            
            let newP = document.createElement("p");
            newP.setAttribute("id", "p" + dataArray[i].name);

            let newLabel = document.createElement("label");
            newLabel.setAttribute("for", "numberOf" + purchasedUpgrades[i].name);
            newLabel.innerText = `Number of ${purchasedUpgrades[i].name}s:`;

            let newInput = document.createElement("input");
            newInput.setAttribute("type", "text");
            newInput.setAttribute("id", "numberOf" + purchasedUpgrades[i].name);
            newInput.value = 0;


            document.getElementById("cookieDetailsSection").appendChild(newP);
            document.getElementById("p" + dataArray[i].name).appendChild(newLabel);
            document.getElementById("p" + dataArray[i].name).appendChild(newInput);
        }
    }

// Update UI
// ******************************************************************************************************************
// ******************************************************************************************************************
    function updateUI(){
        showCookieVariable(numberOfCookies, htmlNumberOfCookies);
        showCookieVariable(cookiesPerSecond, htmlCookiesPerSecond);
    }

    function showCookieVariable(variable, field){
        field.value = variable;
    }

    function purchaseUpgrade(name, cost, cpsIncrease){
        numberOfCookies -= cost;
        cookiesPerSecond += cpsIncrease;
        updateUpgradeArray(name);
    }

    function updateUpgradeArray(name){

        for(let i = 0; i < purchasedUpgrades.length; i++){

            if(name === purchasedUpgrades[i].name){
                purchasedUpgrades[i].value += 1;
                document.getElementById("numberOf"+purchasedUpgrades[i].name).value = purchasedUpgrades[i].value;
            }
        }
    }

// Change Background
// ******************************************************************************************************************
// ****************************************************************************************************************** 
    function changeBackgroundcolour(event){

        event.preventDefault();

        const formData = new FormData(event.target);
        
        const myObject = Object.fromEntries(formData);

        let boxColour = document.body.style.backgroundColor = myObject.colourName;
    }

// Other Functions
// ******************************************************************************************************************
// ******************************************************************************************************************
    function clickCookie(){
        numberOfCookies = numberOfCookies + clickValue;
    }

    function saveBakeryName(){
        let bakeryName = htmlBakeryName.value;
        localStorage.setItem("BakeryName", bakeryName);
    }

    function loadBakeryName(){
        if(localStorage.getItem("BakeryName") === null){
            htmlBakeryName.value = htmlBakeryName.value;
        } else {
            htmlBakeryName.value = localStorage.getItem("BakeryName");
        };
    }

    function saveNumberOfCookies(){
        localStorage.setItem("NumberOfCookies", numberOfCookies);
    }

    function loadNumberOfCookies(){
        if(localStorage.getItem("NumberOfCookies") === null){
            numberOfCookies = 0;
        } else {
            numberOfCookies = parseInt(localStorage.getItem("NumberOfCookies"), 10);
        }
    }

    function isDataFromAPI(){
        if(API === true){
            dataArray = dataFromAPI;
        } else{
            dataArray = dataFromLocal;
        }
    }

    function changeAPIState(){

        if(htmlAPICheckBox.checked === true){
            API = true;
        } else {
            API = false;
        }

        runFromAPI();
    }

    function deleteLocalStorage(){
        localStorage.clear();
        numberOfCookies = 0;
    }
// Event listeners
// ******************************************************************************************************************
// ******************************************************************************************************************
    function createEventListeners(){
        
        let listenForCookieClick = document.getElementById("cookie").addEventListener("click", clickCookie);

        let listenForReset = htmlResetButton.addEventListener("click", function(){
            location.reload();
            });

        let listenForDeleteLocalStorage = htmlDeleteLocalStorageButton.addEventListener("click", deleteLocalStorage)

        let listenForChangeBackgroundcolour = htmlChangeBackgroundForm.addEventListener("submit", function(event){
            
            changeBackgroundcolour(event);
        });

        let listenForSaveBakeryName = htmlSaveBakeryName.addEventListener("click", saveBakeryName);

        let listenForAPICheckboxChange = htmlAPICheckBox.addEventListener("change", changeAPIState);
    }