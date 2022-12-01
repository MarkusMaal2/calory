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
            new Item(0, "Steak Dinner", 1200),
            new Item(1, "Cookie", 200),
            new Item(2, "Eggs", 300),
        ],
        total: 0
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
        }
    }
})();

// UI controller
const UIController = (function() {
    return {
        populateItemList: function(items) {
            let html = ""
            items.forEach(function(item) {
                html += `<li id="item-${item.id}"><strong>${item.name}</strong>: <em>${item.calories}</em> cal</li>`
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
            li.innerHTML = `<strong>${item.name}</strong>: <em>${item.calories}</em> cal`
            document.querySelector("ul").insertAdjacentElement("beforeend", li)
        },
        clearInput: function () {
            document.querySelector("#item-calories").value = ""
            document.querySelector("#item-name").value = ""
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
            UIController.clearInput()
        }
        e.preventDefault()
    }

    return {
        init: function () {
            const items = ItemCtrl.getItems()
            console.log(items)
            UIController.populateItemList(items)
            const totalCalories = ItemCtrl.getTotalCalories()
            UIController.showTotalCalories(totalCalories)

            document.querySelector(".add-button").addEventListener("click", itemAddSubmit)
        }
    }
})(ItemCtrl, UIController);

App.init()
