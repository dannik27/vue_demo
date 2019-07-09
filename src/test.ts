let kekes: string

kekes = 'some_kekes'

class Person {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  sayHello() {
    console.log('Hello, my name is ' + this.name)
  }
}

let petya = new Person('Petya', 20)
petya.sayHello()

console.log(petya)
