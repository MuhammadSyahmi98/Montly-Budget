// Test Code

/*
var budgetController = (function() {
    var x =23;
    
    var add = function(a) {
        return x + a;
    }
    
    return {
        publicTest: function(b) {
            return add(b);
        }
    }
})();




var UIController = (function() {
  
    
})();





var controller = (function(budgetCtrl, UICntrl) {
  
    var z = budgetCtrl.publicTest(5);
    
    
    return {
        anotherPublic: function() {
            console.log(z);
        }
    }
    
    
})(budgetController, UIController); */





















// Budget Controller
var budgetController = (function() {
    
    // Function constructor
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome) {
        
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }     
    };
    
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };
    
    // Function constructor
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var calculateTotal = function(type) {
        var sum = 0;
        // Current refer to income either expenses
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });
        data.totals[type] = sum;
    };
    
    
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        
        budget: 0,
        
        percetage: -1
    };
    
    // Public method
    return {
        addItem: function(type, des, val) {
            
            var newItem, ID;
            
//            ID = 0;
            
//            Create new ID
            if (data.allItems[type].length > 0) {
                 ID = data.allItems[type][data.allItems[type].length -1].id + 1; 
            } else {
                ID = 0;
            }
            
            
            // Create new item
            if (type === 'exp') {
               newItem = new Expense(ID, des, val); 
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return element
            return newItem;
            
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // data.allitems[type][id] = ids == [1,3,4,6]
            // current = 2
            // index = 1 - aaray
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                // splice to delete the element
                // delete one element only
                data.allItems[type].splice(index, 1); 
            }
            
        },
        
        calculateBudget: function() {
            
            // Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
             data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of income that we spent
            
            if (data.totals.inc > 0) {
               data.percetage =Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percetage = -1;
            }
            
            
        },
        
        calculatePercentages: function() {
            
            /*
            a=20
            b=10
            c=20
            inc = 50
            a=20/100 = 20%
            */
            
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
            
            
            
        },
        
        
        
        getPercentages: function() {
            var allperc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            
            return allperc;
        },
        
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percetage: data.percetage
            };
        },
        
        testing: function() {
            console.log(data);
        } 
    };
    
})();






// UI Control
var UIController = (function() {
    
    // Private declarations
    // Object
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };


    var formatNumber = function(num, type) {
        var numSplit, int, dec;
            /*
                + or -
                exactly 2 decimal places
                comma thousands
            */


            num = Math.abs(num); // abs = absoulute to remove sign
            num = num.toFixed(2); // js will convert object into number

            numSplit = num.split('.');

            int = numSplit[0];

            dec = numSplit[1];
            // example int = 3343
            if (int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3,int.length); // first = 3 second = 343 = 3,343
            }

            dec = numSplit[1];

            

            return (type === 'exp' ? '-' :  '+') + ' ' + int + '.' + dec;

       };

       var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };
    
    
    // Create functions to be call
    return {
        
      // Get input from the UI    
      getInput: function() {
          
          // Object to return many values
          return {  
              type: document.querySelector(DOMStrings.inputType).value, // Will be inc or ecp
              description: document.querySelector(DOMStrings.inputDescription).value,
              // Convert string number to float number
              value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
        };
      },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            
            // Create HTML string with placeholder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type === 'exp') {
                element =DOMStrings.expensesContainer;
                html =  '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert HTML into the DOM 
             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);            
        },
        
        deleteListItem: function(selectorID) {
            
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        
        clearField: function() {
            var fields,fieldsArr;
            
            // Put all field into List
            fields =document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            
            // Convert List into Array
            fieldsArr = Array.prototype.slice.call(fields);
            
            // Set fields to empty back // description and value
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            // Focus the cursor to Description field
            fieldsArr[0].focus(); 
        },
        
        
        displayBudget: function(obj) {
            var type;    
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc') ;
            document.querySelector(DOMStrings.expensesLabel).textContent =  formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percetage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percetage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent ='---';
            }
        },
        
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);
            
            
            
            nodeListForEach(fields, function(current, index) {
                if(percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
                 
            });
            
            
        },
           
        displayMonth: function() {
            var now, year, months, month;

           months = ['January', 'February' , 'March', 'April', 'May', ' June', 'July', 'August', 
           'September', 'October', 'November', 'December'];

           

           now = new Date();
           month = now.getMonth();

           year = now.getFullYear();  

          document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + 
                DOMStrings.inputDescription + ',' + 
                DOMStrings.inputValue);

            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        
      // Pass .class variable to be used entire Project    
      getDOMStrings: function() {
            return DOMStrings;
      }
    };

})();



// Global App Controller
var controller = (function(budgetCtrl, UICntrl) {
    
    var setupEventListeners = function() {
        // Call .class variable
        var DOM = UICntrl.getDOMStrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);  // Call function doesnt need to have bracket
    
        document.addEventListener('keypress', function(event) {
            
           // If user press enter it will call a function
           if (event.keyCode === 13 || event.which ===13) {
               ctrlAddItem();
           }
       });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICntrl.changedType);
        
    };
    
    
    var updateBudget = function() {
        
        //        1. Calculate budget
        budgetCtrl.calculateBudget();
        
        //        2. Return budget || get data from budgetCTRL
       var budget = budgetCtrl.getBudget();
        
        //        3. Display the budget on the UI
        UICntrl.displayBudget(budget);
    };
    
    var updatePercentages = function() {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentage s from budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
       UICntrl.displayPercentages(percentages);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        //        1. Get the filed input data
         input = UICntrl.getInput();
        
        // isNaN is Not a Number when the number field is empty
        if(input.description !== "" && !isNaN(input.value) && input.value > 00){
            //        2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            //        3. Add the item to the UI
            UICntrl.addListItem(newItem, input.type);
        
            //        3.1 Clear the fields // Description and value
            UICntrl.clearField();
        
            //        4. Calculate and upadte budget
            updateBudget();
            
            //        5. Calculte and update percentages
            updatePercentages()
        }
        
        
        
        
         
    };
    
    // event == the target element class example .container
    var ctrlDeleteItem = function(event) {
        
        var itemID, splitID, type, ID;
        
        // ParentNode to tranverse up one element
        // This case <i> no longer selected
        // Selected button element
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            //itemID = inc-1 //example id // exp-1
            splitID = itemID.split('-');
            // split == 'inc' '1'
            type = splitID[0]; 
            ID = parseInt(splitID[1]);
            
            // 1.  Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            
            // 2.  Delete the item from GUI
            UICntrl.deleteListItem(itemID);
            
            // 3, Update the new budget and show
            updateBudget();
            
            
            
        }
        
        
    };
    
    
    
    return {
        init: function() {
            
            // Intilize data to display at first start

            UICntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percetage: 0
            });
            
            UICntrl.displayMonth();
            
            setupEventListeners();
        }
    }

    
})(budgetController, UIController);





// Run this code when start the Application
controller.init();



































































