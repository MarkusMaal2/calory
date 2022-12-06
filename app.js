const ItemCtrl = (function() {
    // private
    // ItemCtrl module constructor
    const Item = function (id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }
    // data structure
    const data = {
        items: [
            //new Item(0, "Steak Dinner", 1200),
            //new Item(1, "Cookie", 200),
            //new Item(2, "Eggs", 300),
        ],
        total: 0,
        currentItem: null
    }
    // public
    return {
        logData: function () {
            return data
        },
        getItems: function() {
            return data.items
        },
        getTotalCalories: function() {
            let total = 0
            data.items.forEach(function(item) {
                total += item.calories
            })
            data.total = total
            return data.total
        },
        addItem: function (name, calories) {
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0;
            }
            calories = parseInt(calories)
            let newItem = new Item(ID, name, calories)
            data.items.push(newItem)
            return newItem
        },
        getItem: function (id) {
            let found = null
            ItemCtrl.getItems().forEach(function (item) {
                if (id === item.id) {
                    found = item
                }
            })
            return found
        },
        setCurrentItem: function (item) {
            data.currentItem = item
        },
        getCurrentItem: function () {
            return data.currentItem
        },
        updateItem: function (name, calories) {
            let updatedElement = null
            data.items.forEach(function(item) {
                if (item.id === data.currentItem.id) {
                    item.name = name
                    item.calories = parseInt(calories)
                    updatedElement = item
                }
            })
            return updatedElement
        }
    }
})();

// Storage Controller
const StorageCtrl = (function () {
    return {
        storeItem: function (item) {
            let items
            if (localStorage.getItem("items") === null) {
                items = []
            } else{
                items = JSON.parse(localStorage.getItem("items"))
            }
            items.push(item)
            localStorage.setItem("items", JSON.stringify(items))
        },
        getItemsFromStorage: function () {
            let items
            if (localStorage.getItem("items") === null) {
                items = []
            } else{
                items = JSON.parse(localStorage.getItem("items"))
            }
            return items
        },
        updateLocalStorage: function(item) {
            let items
            if (localStorage.getItem("items") === null) {
                items = []
            } else{
                items = JSON.parse(localStorage.getItem("items"))
            }
            items.forEach(function (itemFromStorage, idx) {
                if (itemFromStorage.id === item.id) {
                    items.splice(idx, 1, item)
                }
            })
            localStorage.setItem("items", JSON.stringify(items))
        }
    }
})();

// UI controller
const UIController = (function() {
    const UISelectors = {
        addBtn: ".add-button",
        itemList: "#item-list",
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        updateBtn: ".update-button",
        listOfItems: "#item-list li"
    }

    return {
        getSelectors: function () {
            return UISelectors
        },

        populateItemList: function(items) {
            let html = ""
            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}"><b>${item.name}</b>
                            <i>${item.calories} cal</i>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a></li>`
            })
            document.querySelector("ul").innerHTML = html
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(".total-calories").textContent = totalCalories
        },

        getItemInput: function (){
            return {
                name: document.querySelector("#item-name").value,
                calories: document.querySelector("#item-calories").value
            }
        },
        addListItem: function(item) {
            const li = document.createElement("li")
            li.id = `item-${item.id}`
            li.className = `collection-item`
            li.innerHTML = `<b>${item.name}</b>
                            <i>${item.calories} cal</i>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`
            document.querySelector("ul").insertAdjacentElement("beforeend", li)
        },
        clearInput: function () {
            document.querySelector("#item-calories").value = ""
            document.querySelector("#item-name").value = ""
        },
        showEditState: function() {
            document.querySelector(UISelectors.addBtn).style.display = "none"
            document.querySelector(UISelectors.updateBtn).style.display = "inline"
        },
        clearEditState: function () {
            document.querySelector(UISelectors.addBtn).style.display = "inline"
            document.querySelector(UISelectors.updateBtn).style.display = "none"
        },
        addItemToForm: function ()
        {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories
            UIController.showEditState()
        },
        updateItem: function (item) {
            const listOfItems = document.querySelectorAll(UISelectors.listOfItems)
            listOfItems.forEach(function (listItem) {
                let listItemID = listItem.getAttribute("id")
                if (`item-${item.id}` === listItemID) {
                    document.querySelector("#" + listItemID).innerHTML = `<b>${item.name}</b>
                    <i>${item.calories} cal</i>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }
            })
        }
    }
})();

// App controller
const App = (function () {

    const itemAddSubmit = function(e) {
        const userInput = UIController.getItemInput()
        if (userInput.name !== "" && userInput.calories !== "") {
            const newItem = ItemCtrl.addItem(userInput.name, userInput.calories)
            UIController.addListItem(newItem)
            StorageCtrl.storeItem(newItem)
            UIController.showTotalCalories(ItemCtrl.getTotalCalories())
            UIController.clearInput()
        }
        e.preventDefault()
    }

    const itemEditSubmit = function(e) {
        if (e.target.classList.contains("edit-item")) {
            const listID = e.target.parentNode.parentNode.id
            // split string from "-" and get second element, which gets parsed as an integer
            const id = parseInt(listID.split("-")[1])
            const editableItem = ItemCtrl.getItem(id)
            ItemCtrl.setCurrentItem(editableItem)
            UIController.addItemToForm()
        }
    }

    const getItemsFromStorage = function () {
        const items = StorageCtrl.getItemsFromStorage()
        items.forEach(function (item) {
            ItemCtrl.addItem(item.name, item.calories)
        })
        const totalCalories = ItemCtrl.getTotalCalories()
        UIController.showTotalCalories(totalCalories)
        UIController.populateItemList(items)
    }

    const itemUpdateSubmit = function (e) {
        const input = UIController.getItemInput()
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        UIController.updateItem(updatedItem)
        StorageCtrl.updateLocalStorage(updatedItem)
        UIController.clearInput()
        UIController.clearEditState()
        UIController.showTotalCalories(ItemCtrl.getTotalCalories())
        e.preventDefault()
    }

    const loadEventListeners = function (){
        const UISelectors = UIController.getSelectors()
        document.addEventListener('DOMContentLoaded', getItemsFromStorage)
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditSubmit)
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit)
        document.addEventListener("DOMContentLoaded", getItemsFromStorage)
    }

    return {

        init: function () {
            loadEventListeners()
            UIController.clearEditState()
            //const items = ItemCtrl.getItems()
            //console.log(items)
            //UIController.populateItemList(items)
            //const totalCalories = ItemCtrl.getTotalCalories()
            //UIController.showTotalCalories(totalCalories)

            document.querySelector(".add-button").addEventListener("click", itemAddSubmit)
        }
    }
})(ItemCtrl, UIController, StorageCtrl);

App.init()
