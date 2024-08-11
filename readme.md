### README para los Patrones de Diseño en Node.js

---

## Índice

1. [Singleton Pattern](#singleton-pattern)
2. [Factory Pattern](#factory-pattern)
3. [Observer Pattern](#observer-pattern)
4. [Decorator Pattern](#decorator-pattern)
5. [Middleware Pattern](#middleware-pattern)
6. [Dependency Injection Pattern](#dependency-injection-pattern)
7. [MVC (Model-View-Controller) Pattern](#mvc-pattern)

---

### <a id="singleton-pattern"></a>1. Singleton Pattern

**Descripción**  
El patrón Singleton garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a dicha instancia. Este patrón es útil para controlar un recurso compartido o mantener un estado global en la aplicación.

**Implementación en Node.js**  
En Node.js, los módulos se comportan naturalmente como Singletons. Esto significa que cuando se `require` un módulo, la misma instancia es compartida a través de toda la aplicación.

**Ejemplo**

```javascript
// logger.js
class Logger {
  constructor() {
    if (Logger.instance == null) {
      this.logs = [];
      Logger.instance = this;
    }
    return Logger.instance;
  }

  log(message) {
    this.logs.push(message);
    console.log(`Log: ${message}`);
  }

  printLogCount() {
    console.log(`${this.logs.length} Logs`);
  }
}

const logger = new Logger();
Object.freeze(logger);  // Previene modificaciones a la instancia

module.exports = logger;
```

**Uso**

```javascript
// app.js
const logger = require('./logger');

logger.log('This is the first log');
logger.printLogCount();  // 1 Logs

const anotherLogger = require('./logger');
anotherLogger.log('This is the second log');
anotherLogger.printLogCount();  // 2 Logs

console.log(logger === anotherLogger);  // true
```

---

### <a id="factory-pattern"></a>2. Factory Pattern

**Descripción**  
El patrón Factory proporciona una manera de crear objetos sin especificar la clase exacta del objeto que se creará. Este patrón es útil cuando el proceso de creación requiere lógica adicional.

**Implementación en Node.js**  
En Node.js, el patrón Factory se puede implementar utilizando funciones que retornan instancias de objetos basados en parámetros.

**Ejemplo**

```javascript
// vehicleFactory.js
class Car {
  constructor() {
    this.type = 'Car';
  }
}

class Truck {
  constructor() {
    this.type = 'Truck';
  }
}

class VehicleFactory {
  createVehicle(vehicleType) {
    switch (vehicleType) {
      case 'car':
        return new Car();
      case 'truck':
        return new Truck();
      default:
        throw new Error('Unknown vehicle type');
    }
  }
}

module.exports = VehicleFactory;
```

**Uso**

```javascript
// app.js
const VehicleFactory = require('./vehicleFactory');
const factory = new VehicleFactory();

const car = factory.createVehicle('car');
console.log(car.type);  // Car

const truck = factory.createVehicle('truck');
console.log(truck.type);  // Truck
```

---

### <a id="observer-pattern"></a>3. Observer Pattern

**Descripción**  
El patrón Observer define una relación de dependencia uno-a-muchos entre objetos, de modo que cuando un objeto cambia de estado, todos sus dependientes son notificados y actualizados automáticamente.

**Implementación en Node.js**  
Este patrón es útil para eventos, donde un objeto "sujeto" notifica a múltiples "observadores".

**Ejemplo**

```javascript
// Subject.js
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Observer.js
class Observer {
  constructor(name) {
    this.name = name;
  }

  update(data) {
    console.log(`${this.name} received data: ${data}`);
  }
}

module.exports = { Subject, Observer };
```

**Uso**

```javascript
// app.js
const { Subject, Observer } = require('./Subject');

const subject = new Subject();
const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.subscribe(observer1);
subject.subscribe(observer2);

subject.notify('Hello Observers!');  // Observer 1 and Observer 2 receive the data
```

---

### <a id="decorator-pattern"></a>4. Decorator Pattern

**Descripción**  
El patrón Decorator permite añadir funcionalidad a un objeto de manera dinámica sin modificar su estructura original. Es útil cuando necesitas extender la funcionalidad de clases sin heredar de ellas.

**Implementación en Node.js**  
Se implementa creando una función que toma un objeto y lo envuelve con funcionalidades adicionales.

**Ejemplo**

```javascript
// coffee.js
class Coffee {
  cost() {
    return 5;
  }
}

// milkDecorator.js
function milkDecorator(coffee) {
  coffee.cost = function () {
    return coffee.cost() + 1.5;
  };
  return coffee;
}

module.exports = { Coffee, milkDecorator };
```

**Uso**

```javascript
// app.js
const { Coffee, milkDecorator } = require('./coffee');

let myCoffee = new Coffee();
console.log(myCoffee.cost());  // 5

myCoffee = milkDecorator(myCoffee);
console.log(myCoffee.cost());  // 6.5
```

---

### <a id="middleware-pattern"></a>5. Middleware Pattern

**Descripción**  
El patrón Middleware es muy común en aplicaciones Node.js, especialmente en frameworks como Express. Permite agregar funcionalidades adicionales (como autenticación, manejo de errores, etc.) en la cadena de manejo de solicitudes.

**Implementación en Node.js**  
Se implementa encadenando funciones que procesan una solicitud antes de que llegue al manejador final.

**Ejemplo**

```javascript
// middleware.js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

function auth(req, res, next) {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

module.exports = { logger, auth };
```

**Uso**

```javascript
// app.js
const express = require('express');
const { logger, auth } = require('./middleware');

const app = express();

app.use(logger);
app.use(auth);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### <a id="dependency-injection-pattern"></a>6. Dependency Injection Pattern

**Descripción**  
El patrón Dependency Injection maneja las dependencias de las clases de manera más flexible y modular, permitiendo inyectar las dependencias desde afuera en lugar de instanciarlas internamente.

**Implementación en Node.js**  
Se puede implementar inyectando dependencias a través del constructor o mediante setters.

**Ejemplo**

```javascript
// logger.js
class Logger {
  log(message) {
    console.log(`Log: ${message}`);
  }
}

// userService.js
class UserService {
  constructor(logger) {
    this.logger = logger;
  }

  createUser(user) {
    this.logger.log(`Creating user: ${user.name}`);
    // logic to create user
  }
}

module.exports = { Logger, UserService };
```

**Uso**

```javascript
// app.js
const { Logger, UserService } = require('./logger');

const logger = new Logger();
const userService = new UserService(logger);

userService.createUser({ name: 'John Doe' });
```

---

### <a id="mvc-pattern"></a>7. MVC (Model-View-Controller) Pattern

**Descripción**  
El patrón MVC divide una aplicación en tres partes interconectadas: el Modelo gestiona los datos, la Vista presenta los datos y el Controlador maneja la entrada del usuario.

**Implementación en Node.js**  
Este patrón es comúnmente utilizado en aplicaciones web para separar las responsabilidades y facilitar la mantenibilidad.

**Ejemplo**

**Modelo**

```javascript
// userModel.js
class UserModel {
  constructor() {
    this.users = [];
  }

  create(user) {
    this.users.push(user);
    return user;
  }

  getAll() {
    return this.users;
  }
}

module.exports = UserModel;
```

**Vista**

```javascript
// userView.js
class UserView {
  render(users) {
    users.forEach(user => {
      console.log(`User: ${user.name}`);
    });
  }
}

module.exports = UserView;
```

**Controlador**

```javascript
// userController.js
class UserController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  addUser(name) {
    const user = this.model.create({ name });
    this.view.render([user]);
  }

  showAllUsers() {
    const users = this.model.getAll();
    this.view.render(users);
  }
}

module.exports = UserController;
```

**Uso**

```javascript
// app.js
const UserModel = require('./userModel');
const UserView = require('./userView');
const UserController = require('./userController');

const model = new UserModel();
const view = new UserView();
const controller = new User

Controller(model, view);

controller.addUser('John Doe');
controller.showAllUsers();
```

