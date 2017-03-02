var dataService = {};
dataService.getAllAlbumsData = function(){
     return  [{
        name : "Showbiz",
        songs : [
            { name : 'Muscle Museum', min : 4, sec: 23},
            { name : 'Fillip', min : 4, sec: 1},
            { name : 'Muscle Museum', min : 4, sec: 33},
            { name : 'Showbiz', min : 5, sec: 16},
            { name : 'Unintended', min : 3, sec: 57},
            { name : 'Uno', min : 3, sec: 37},
            { name : 'Sober', min : 4, sec: 4},
            { name : 'Escape', min : 3, sec: 31},
            { name : 'Overdue', min : 2, sec: 26},
            { name : 'Escape', min : 3, sec: 31},
            { name : "Hate This & I'll Love You", min : 2,sec: 26}
           ]
    }, {
            name : "Origin of Symmetry",
            songs : [
                { name : 'New Born', min : 6, sec: 3},
                { name : 'Bliss', min : 4, sec: 22},
                { name : 'Space Dementia', min : 6, sec: 20},
                { name : 'Hyper Music', min : 3, sec: 21},
                { name : 'Plug In Baby', min : 3, sec: 39},
                { name : 'Citizen Erased', min : 7, sec: 19},
                { name : 'Screenager', min : 4, sec: 47},
                { name : 'Darkshines', min : 3, sec: 31},
                { name : 'Feeling Good', min : 3, sec: 39},
                { name : 'Megalomania', min : 4, sec: 48},
                { name : 'Futurism**', min : 3,sec: 27}
            ]
        }]
};



module.exports = dataService;