
let persons = [
  {
    id: 1,
    name: "Vasya local",
    age: 21
  },
  {
    id: 2,
    name: "Petya local",
    age: 43
  },
  {
    id: 3,
    name: "Misha local",
    age: 14
  }
];

export default {
  getPersons : function() {
    return new Promise(resolve => {
      resolve(persons);
    });
  },

  savePerson: function(person) {
    persons.push(person)
  }
}