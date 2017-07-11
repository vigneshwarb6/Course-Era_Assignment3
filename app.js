(function(){
'use strict';
angular.module('MenuApp',[])
.controller('MenuController',MenuController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems',foundItems)
.constant('ApiBasePath',"https://davids-restaurant.herokuapp.com");

function foundItems(){
    var ddo={
        restrict:'E',
        templateUrl: 'foundItems.html',
        scope:{
            menu: '<foundItems',
            title: '@title',
            onRemove:'&',
            message: '@message'
        }
    };
    return ddo;
}

MenuController.$inject=['MenuSearchService'];

function MenuController(MenuSearchService)
{
var service=this;
service.Item='';
service.foundItems='';
service.Message=" ";
service.searchItem=function()
{
    if(service.Item.length!==0){        
 service.foundItems=MenuSearchService.searchItem(service.Item.toLowerCase());
    }
    else{
        console.log("hi");
        service.Message="Nothing found";
    }
};

service.onRemove=function(itemIndex)
{
service.foundItems=MenuSearchService.removeItem(itemIndex,service.foundItems);
};

}

MenuSearchService.$inject=['$http','ApiBasePath'];
function MenuSearchService($http,ApiBasePath){
var statusErr='';
var list=this;
list.searchItem=function(Item)
{
 var foundItems=[];   
    $http({
        method:'GET',
        url:(ApiBasePath + "/menu_items.json")       
    }).then(function(response){
        retrieveItem(response.data.menu_items,Item,foundItems);                       
        statusErr=response.status;
    },function(response)
    {
        totalItems=response.data.menu_items;
        statusErr=response.status;
    });
   return foundItems;
};

list.removeItem=function(Index,foundItems)
{    
   console.log(Index);
   foundItems.splice(Index,1);
   return foundItems;
}

var retrieveItem=function(data,Item,foundItems)
{   
    for(var i=0;i<data.length;i++){  
    if(data[i].description.toLowerCase().indexOf(Item)>-1)
    {
        foundItems.push(data[i]);
    }
}};

}



})();