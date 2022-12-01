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
        }
    }
})();

// App controller
const App = (function () {
    return {
        init: function () {
            const items = ItemCtrl.getItems()
            console.log(items)
            UIController.populateItemList(items)
            const totalCalories = ItemCtrl.getTotalCalories()
            UIController.showTotalCalories(totalCalories)
        }
    }
})(ItemCtrl, UIController);

App.init()
