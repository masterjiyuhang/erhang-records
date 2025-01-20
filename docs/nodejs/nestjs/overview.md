## 概述

为了熟悉 Nest 应用程序的基本构建块，我们将构建一个基本的 CRUD 应用程序，其功能涵盖了入门级的许多基础知识。

必要前置条件

node version >= 16

创建项目

```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```

核心文件的简要概述

| `app.controller.ts`      | 基本的控制器文件，其中包含一个或多个路由处理程序（route handlers）。负责接收来自客户端的 HTTP 请求，并根据请求的内容执行相应的操作，然后返回响应给客户端。在这个文件中通常会定义一些路由处理方法，用于处理不同路径的请求。 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.controller.spec.ts` | 控制器的单元测试文件，用于测试控制器中定义的路由处理方法的功能和行为。用于验证代码的各个单元（如函数、方法）是否按预期工作。                                                                                               |
| `app.module.ts`          | 应用程序的根模块文件，也是 NestJS 应用程序的入口点之一。在根模块中通常会定义应用程序的各种模块、控制器和提供者（services、providers），并进行模块之间的导入和导出，以构建整个应用程序的依赖关系图。                        |
| `app.service.ts`         | 一个基本的服务文件，其中包含一个或多个方法用于执行某些具体的业务逻辑。服务通常用于封装业务逻辑，并可以在控制器、其他服务或者模块中进行调用，以实现应用程序的功能。                                                         |
| `main.ts`                | 应用程序的入口文件，其中使用 NestFactory 核心函数来创建 Nest 应用程序的实例。在这个文件中，通常会配置应用程序的全局设置，如中间件、全局拦截器等，并启动应用程序监听特定的端口，开始处理来自客户端的请求。                  |

### 1. 控制器

Controllers 入口文件

Controllers are responsible for handling incoming requests and returning responses to the client. 控制器负责处理传入请求并向客户端返回响应。

- receive specific requests 接收特定的请求
- routing mechanism 路由机制
  - controls which controller receives which requests 控制哪个控制器接收哪个请求。
- each controller has more than one route
  - Different routes can perform different actions.不同的路由可以执行不同的动作。

#### 创建一个基础的控制器

- 控制器负责处理来自客户端的请求，并根据路由机制将这些请求路由到相应的控制器上。
- 使用装饰器可以将类与所需的元数据关联起来，使得 Nest 能够根据这些元数据创建路由映射，从而实现请求与控制器方法的绑定。
- 要快速创建一个带有内置验证的 CRUD 控制器，在 NestJS 中，你可以使用 CLI 的 CRUD 生成器。
  - `nest g resource [name]`
  - 命令中使用的选项说明如下：
    - `--no-spec`：这个选项告诉 CLI 不要生成控制器文件的规范（测试）文件。
    - `--flat`：这个选项告诉 CLI 将控制器文件生成在根目录而不是在一个单独的文件夹中。
    - `--crud`：这个选项告诉 CLI 生成一个具有标准 CRUD 操作的控制器。

#### 路由信息

- 使用 @Controller() 装饰器来定义基本控制器的示例

  - @Controller() 装饰器用于定义控制器，其中可以指定一个可选的路由路径前缀，比如 cats。

  - 在 @Controller() 装饰器中使用路径前缀可以轻松地将一组相关的路由分组起来，并减少重复的代码。

    - ```ts
      import { Controller, Get } from "@nestjs/common";

      @Controller("cats")
      export class CatsController {
        @Get()
        findAll(): string {
          return "This action returns all cats";
        }
      }
      ```

  - `nest g controller [name]`

- 通过 @Get() HTTP 请求方法装饰器来告诉 Nest 创建一个特定端点的处理程序，用于处理 HTTP 请求。这个端点对应于 HTTP 请求方法（在这种情况下是 GET）和路由路径。路由路径是指处理程序所对应的路径。

- 在 Nest 中，路由路径由控制器声明的（可选的）前缀和方法装饰器中指定的任何路径信息拼接而成。在这个示例中，我们为控制器声明了一个前缀（cats），并且在方法装饰器中没有添加任何路径信息，因此 Nest 将会将 GET /cats 请求映射到这个处理程序上。这里的路由路径包括可选的控制器路径前缀以及请求方法装饰器中声明的任何路径字符串。

  - 举例来说，如果我们的控制器有一个路径前缀 cats，并且在方法装饰器中使用了 @Get('breed')，那么这会产生一个路由映射，用于处理类似 GET /cats/breed 这样的请求。

- 在我们上面的例子中，当向其发送一个 get 请求时，nest 可以自动帮我们把请求定位到 findAll 方法。

- findAll 是我们自己定义的，可以叫任何名字，你叫他 wangcai 都没有问题。 我们自己定义方法的名字时，可能比较关注他的语意信息，但是 nest 是不会关注这个方法名字是否有具体含义的。

##### 返回值

方法会默认返回 200 状态码和关联的返回体。

###### 关于返回值的两种选项

- 标准 Standard （推荐使用）
  - 当请求处理程序返回一个 JavaScript 对象或数组时，它将自动序列化为 JSON。
  - 它返回一个 JavaScript 基本类型（例如字符串、数字、布尔值）时，Nest 只会发送该值，而不会尝试对其进行序列化。
  - 默认情况下，响应的状态码始终为 200，除了使用 201 的 POST 请求。
    - 可以使用装饰器修改响应状态码 `HttpCode(300)`
- 特定哭 Library-specific
  - 使用特定于库（例如 Express）的响应对象
  - 在方法处理程序签名中使用 @Res() 装饰器来注入该对象（例如，findAll(@Res() response)）
    - 使用这种方法，你可以自主修改返回的对象
    - `response.status(200).send()`

#### 请求对象

Requset Object

处理程序通常需要访问客户端请求详细信息。Handlers often need access to the client request details。

我们可以通过将 @Req() 装饰器添加到处理程序的签名来指示 Nest 注入请求对象来访问请求对象。

```tsx
import { Controller, Get, Req } from "@nestjs/common";

@Controller("cars")
export class CarsController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request);
    return "all cars";
  }
}
```

#### 资源

Resources

##### 创建一个 Post 接口

```ts
  @Post()
  create(@Param() params: Parameters<any>): string {
    console.log(params);
    return 'create new car';
  }
```

##### HTTP 方法

Nest 为所有标准 HTTP 方法提供装饰器

`@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`, `@Options()`, and `@Head()`.

此外，`@All()` 定义了一个处理所有 HTTP 方法的端点。

#### 路由通配符 \*

Route wildcards

```ts
@Get('ab*cd')
findAll() {
  return 'find all';
}
```

这个路由 `'ab*cd'` 可以匹配到 `abcd`, `ab_cd`, `abecd`

#### 请求装饰器

The request object has properties for the request query string, parameters, Http headers, and body.

大多数情况下，不是每一个属性都是必须要的。我们可以使用其他装饰器替代`@Req`，比如使用`@Body` 或者`@Query`。

| `@Request(), @Req()`        | `req`                               |
| --------------------------- | ----------------------------------- |
| `@Response(), @Res()`**\*** | `res`                               |
| `@Next()`                   | `next`                              |
| `@Session()`                | `req.session`                       |
| `@Param(key?: string)`      | `req.params` / `req.params[key]`    |
| `@Body(key?: string)`       | `req.body` / `req.body[key]`        |
| `@Query(key?: string)`      | `req.query` / `req.query[key]`      |
| `@Headers(name?: string)`   | `req.headers` / `req.headers[name]` |
| `@Ip()`                     | `req.ip`                            |
| `@HostParam()`              | `req.hosts`                         |

##### @HttpCode 装饰器

用于修改响应状态码

```ts
@Post()
@HttpCode(304)
create() {
  return 'This action adds a new cat';
}
```

##### @Header 装饰器

用于修改响应头信息

指定一个自定义响应头 `@Header()`

例子: `@Header('Cache-Control', 'none')`

##### @Redirect 装饰器

将响应重定向到特定 URL

`@Redirect(url, statusCode)`

eg: `Redirect('https://www.baidu.com', 301)`

##### @Param 装饰器

可以使用 @Param() 装饰器访问**在路由的路径中添加路由参数标记声明**的路由参数，

```typescript
@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

#### 异步性

Asynchronicity

```tsx
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

#### 请求参数

Request payloads

POST 路由处理程序中添加 @Body() 装饰器来接收客户端参数。

如果你使用 TypeScript，我们需要确定 DTO（数据传输对象）的模式。DTO 是一个定义数据将如何通过网络发送的对象。决定数据传输对象的类型！！

可以通过使用 TypeScript 接口或简单的类来确定 DTO 模式。**这里推荐使用类**。为什么呢？因为类是 JavaScript ES6 标准的一部分，因此它们在编译后的 JavaScript 中被保留为真实实体。另一方面，由于 TypeScript 接口在转译过程中被移除，Nest 无法在运行时引用它们。

创建一个 CreateCarDTO 类

```tsx
// /car/dto/create-car.dto.ts
import { IsBoolean, IsInt, IsString } from "class-validator";

export class CrateCarDto {
  @IsString()
  readonly name: string;

  @IsInt()
  readonly years: number;

  @IsString()
  readonly color: string;

  @IsBoolean()
  readonly isOverLoad: boolean;
}

// car.controllers.ts
import { Body, Controller, Get, Header, Post, Req } from "@nestjs/common";
import { CrateCarDto } from "./dto/create-car.dto";

@Controller("cars")
export class CarsController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request);
    return "all cars";
  }

  @Post()
  @Header("Content-Type", "application/json")
  create(
    @Body() { name, color, years, isOverLoad = false }: CrateCarDto,
  ): string {
    console.log(name, years, color, isOverLoad);
    return "create new car " + name;
  }
}
```

#### 启动并运行

Getting up and running

Controllers 控制器始终属于一个 module 模块，这就是为什么我们在 @Module() 装饰器中包含控制器数组的原因。

```ts
// car/car.module.ts

import { Module } from "@nestjs/common";
import { CarsController } from "./car.controller";

@Module({
  controllers: [CarsController],
})
export class CarModule {}
```

### 2. Providers

Provider 的作用在于为应用程序的不同部分提供可重用的、模块化的功能，并通过依赖注入的方式来管理这些功能之间的关系，从而使得代码更加易于维护和测试。

在 Nest 中，许多基本的类可以被视为 Provider，包括服务、仓储、工厂、辅助类等等（`service`,` repository`, `factory`, `helper` ）。

Provider 的主要概念是它可以作为依赖项进行注入。对象之间可以创建各种关系，并且“连接”这些对象的功能可以很大程度上委托给 Nest 运行时系统。 Provider 只是一个用 `@Injectable()` 装饰器注释的类。

控制器应处理 `HTTP` 请求并将更复杂的任务委托给 **providers**。`Providers` 是纯粹的 `JavaScript` 类，在其类声明之前带有 `@Injectable()`装饰器。

#### Services 服务

创建一个简单的 CarServie

`@Injectable() `装饰器附加元数据，声明了 CatsService 是一个可以由 `Nest IoC`（Inversion of Control，控制反转）容器管理的类。 `IoC` 容器是 Nest 框架中的一个重要概念，用于管理应用程序中各种依赖项的生命周期和依赖关系。

通过将 `@Injectable()` 装饰器应用于`CatsService`类，我们告诉 Nest 框架该类可以被注入到其他类中，以及在需要时可以由 Nest IoC 容器进行实例化和管理。这使得我们可以在其他地方通过依赖注入的方式轻松地访问 `CatsService`，并利用 Nest 框架提供的各种功能来管理它的生命周期和作用域。

```tsx
import { Injectable } from "@nestjs/common";
import { Car } from "./interfaces/car.interface";

@Injectable()
export class CarService {
  private readonly cars: Car[] = [];

  create(car: Car) {
    console.log(car, "car service created");
    this.cars.push(car);
  }

  findAll(): Car[] {
    return this.cars;
  }
}
```

#### 快速生成 service 指令

command

要是用 cli 创建服务类，可以执行以下命令：

`nest g service cats`

创建出来的 CarService 具有一个属性和两个方法。 注意`@Injectable()`装饰器，该 `@Injectable()` 附加有元数据，因此 `Nest` 知道这个类是一个 `Nest` provider。需要注意的是，上面有一个 `Car` 接口。看起来像这样

```ts
// interface/car.interface.ts
export interface Car {
  name: string;
  years: number;
  color: string;
  isOverload: boolean;
}
```

现在我们有一个服务类来检索 `car` ，让我们在 `Catrcontroller` 里使用它 ：

```ts
import { Body, Controller, Get, Header, Param, Post } from "@nestjs/common";
import { CrateCarDto } from "./dto/create-car.dto";
import { CarService } from "./car.service";
import { Car } from "./interfaces/car.interface";
import { ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("Car")
@Controller("car")
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get("list")
  async findAll(): Promise<Car[]> {
    return this.carService.findAll();
  }

  @Get("/:id")
  @Header("Content-Type", "application/json")
  @ApiParam({
    name: "id",
    type: Number,
    description: "car id",
  })
  findOne(@Param("id") id: number | string): any {
    return {
      id: id,
      name: "一个车",
    };
  }

  @Post("create")
  @Header("Content-Type", "application/json")
  create(
    @Body() { name, color, years, isOverload = false }: CrateCarDto,
  ): void {
    return this.carService.create({ name, color, years, isOverload });
  }
}
```

`CarService` 是通过类构造函数注入的。注意这里使用了私有的只读语法。这意味着我们已经在同一位置创建并初始化了 `carService `成员。

#### 依赖注入

Dependency injection

在 `Nest` 中，借助 **TypeScript** 功能，管理依赖项非常容易，因为它们仅按类型进行解析。在下面的示例中，`Nest` 将 `catsService` 通过创建并返回一个实例来解析 `CatsService`（或者，在单例的正常情况下，如果现有实例已在其他地方请求，则返回现有实例）。解析此依赖关系并将其传递给控制器的构造函数（或分配给指定的属性）：

`constructor(private readonly carService: CarService) {}`

#### [作用域](https://docs.nestjs.cn/10/providers?id=作用域)

Provider 通常具有与应用程序生命周期同步的生命周期（“作用域”）。在启动应用程序时，必须解析每个依赖项，因此必须实例化每个提供程序。同样，当应用程序关闭时，每个 provider 都将被销毁。但是，有一些方法可以改变 provider 生命周期的请求范围。您可以[在此处](https://docs.nestjs.cn/8/fundamentals?id=注射范围)详细了解这些技术。

#### [自定义 providers](https://docs.nestjs.cn/10/providers?id=自定义提供者)

`Nest` 有一个内置的控制反转（`"IoC"`）容器，可以解决 providers 之间的关系。 此功能是上述依赖注入功能的基础，但要比上面描述的要强大得多。`@Injectable()` 装饰器只是冰山一角, 并不是定义 providers 的唯一方法。相反，您可以使用普通值、类、异步或同步工厂。看看[这里](https://docs.nestjs.cn/8/fundamentals)找到更多的例子。

#### 可选 providers

有时，您可能需要解决一些依赖项。例如，您的类可能依赖于一个**配置对象**，但如果没有传递，则应使用默认值。在这种情况下，关联变为可选的， `provider` 不会因为缺少配置导致错误。

#### Provider 注册

现在我们已经定义了一个提供者（CatsService），并且有一个使用该服务的消费者（CatsController），我们需要将该服务注册到 Nest 中，以便进行注入。我们通过编辑我们的模块文件（app.module.ts），并将服务添加到 @Module() 装饰器的 providers 数组中来实现这一点。

```tsx
// cars/car.module.ts
import { Module } from "@nestjs/common";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";

@Module({
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}

// app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CoreModule } from "./core/core.module";
import { CarModule } from "./cars/car.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [CoreModule, CarModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 3. Modules

模块是具有 `@Module()` 装饰器的类。 `@Module()` 装饰器提供了元数据，Nest 用它来组织应用程序结构。

每个 Nest 应用程序至少有一个模块，即根模块。根模块是 Nest 开始安排应用程序树的地方。事实上，根模块可能是应用程序中唯一的模块，特别是当应用程序很小时，但是对于大型程序来说这是没有意义的。在大多数情况下，您将拥有多个模块，每个模块都有一组紧密相关的**功能**。

`@module()` 装饰器接受一个描述模块属性的对象：

|             |                                                            |
| ----------- | ---------------------------------------------------------- |
| providers   | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| controllers | 必须创建的一组控制器                                       |
| imports     | 导入模块的列表，这些模块导出了此模块中所需提供者           |
| exports     | 由本模块提供并应在其他模块中可用的提供者的子集。           |

默认情况下，该模块**封装**提供程序。这意味着无法注入既不是当前模块的直接组成部分，也不是从导入的模块导出的提供程序。因此，您可以将从模块导出的提供程序视为模块的公共接口或 API。

#### 功能模块

`CarController` 和 `CarService` 属于同一个应用程序域。 应该考虑将它们移动到一个功能模块下，即 `CarModule`。

```tsx
import { Module } from "@nestjs/common";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";

@Module({
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
```

要使用 CLI 创建模块，只需执行 `$ nest g module car` 命令。

我已经创建了 `car.module.ts` 文件，并把与这个模块相关的所有东西都移到了 cars 目录下。我们需要做的最后一件事是将这个模块导入根模块 `(ApplicationModule)`。

```tsx
import { Module } from "@nestjs/common";
import { CarModule } from "./cars/car.module";

@Module({
  imports: [CarModule],
})
export class ApplicationModule {}
```

#### 共享模块

在 Nest 中，默认情况下，模块是**单例**，因此您可以轻松地在多个模块之间共享**同一个**提供者实例。

实际上，每个模块都是一个**共享模块**。一旦创建就能被任意模块重复使用。假设我们将在几个模块之间共享 `CarService` 实例。 我们需要把 `CarService` 放到 `exports` 数组中，如下所示：

`export class CarModule {}`

现在，每个导入 `CarModule` 的模块都可以访问 `CarService` ，并且它们将共享相同的 `CarService` 实例。

#### 模块导出

模块可以导出他们的内部提供者。 而且，他们可以再导出自己导入的模块。

```ts
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

#### 依赖注入

提供者也可以注入到模块(类)中（例如，用于配置目的）：

> car.module.ts

```ts
import { Module } from "@nestjs/common";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";

@Module({
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {
  constructor(private readonly carService: CarService) {}
}
```

#### 全局模块

`@Global` 装饰器使模块成为全局作用域。 全局模块应该只注册一次，最好由根或核心模块注册。 在下面的例子中，`CarService` 组件将无处不在，而想要使用 `CarService` 的模块则不需要在 `imports` 数组中导入 `CarModule`。

```ts
import { Module, Global } from "@nestjs/common";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";

@Global()
@Module({
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
```

#### 动态模块

Nest 的模块系统包括一个称为动态模块的强大功能。此功能可以帮助我们轻松创建自定义模块，这些模块可以动态注册和配置提供程序。

以下是一个动态模块定义的示例 `DatabaseModule`：

```ts
import { Module, DynamicModule } from "@nestjs/common";
import { createDatabaseProviders } from "./database.providers";
import { Connection } from "./connection.provider";

@Module({
  providers: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```

`forRoot()` 可以同步或异步（`Promise`）返回动态模块。

此模块 `Connection` 默认情况下（在 `@Module()` 装饰器元数据中）定义提供程序，但此外-根据传递给方法的 `entities` 和 `options` 对象 `forRoot()` -公开提供程序的集合，例如存储库。请注意，动态模块返回的属性扩展（而不是覆盖）`@Module()` 装饰器中定义的基本模块元数据。这就是从模块导出静态声明的 `Connection` 提供程序和动态生成的存储库提供程序的方式。

如果要在全局范围内注册动态模块，请将 `global` 属性设置为 `true`。

```ts
{
  global: true,
  module: DatabaseModule,
  providers: providers,
  exports: providers,
}

```

### 4. Middleware

中间件是在路由处理程序 **之前** 调用的函数。 中间件函数可以访问请求和响应对象，以及应用程序请求响应周期中的 `next()` 中间件函数。 `next()` 中间件函数通常由名为 `next` 的变量表示。

Nest 中间件实际上等价于 [express](http://expressjs.com/en/guide/using-middleware.html) 中间件。 下面是 Express 官方文档中所述的中间件功能：

中间件函数可以执行以下任务:

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 `next()` 将控制传递给下一个中间件函数。否则, 请求将被挂起。

您可以在函数中或在具有 `@Injectable()` 装饰器的类中实现自定义 `Nest`中间件。 这个类应该实现 `NestMiddleware` 接口, 而函数没有任何特殊的要求。 让我们首先使用类方法实现一个简单的中间件功能。

> logger.middleware.ts

```tsx
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}
```

#### 依赖注入

`Nest`中间件完全支持依赖注入。 就像提供者和控制器一样，它们能够**注入**属于同一模块的依赖项（通过 `constructor` ）。

```typescript
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CarModule } from "./cars/car.module";

@Module({
  imports: [CarModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("cars");
  }
}
```

我们还可以在配置中间件时将包含路由路径的对象和请求方法传递给`forRoutes()`方法。我们为之前在`CarController`中定义的`/cats`路由处理程序设置了`LoggerMiddleware`。我们还可以在配置中间件时将包含路由路径的对象和请求方法传递给 `forRoutes()`方法，从而进一步将中间件限制为特定的请求方法。

#### 路由通配符

路由同样支持模式匹配。例如，星号被用作**通配符**，将匹配任何字符组合。

```ts
forRoutes({ path: "ab*cd", method: RequestMethod.ALL });
```

#### 中间件消费者

`MiddlewareConsumer` 是一个帮助类。它提供了几种内置方法来管理中间件。他们都可以被简单地**链接**起来。`forRoutes()` 可接受一个字符串、多个字符串、对象、一个控制器类甚至多个控制器类。在大多数情况下，您可能只会传递一个由逗号分隔的控制器列表。以下是单个控制器的示例：

> app.module.ts

```typescript
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CarModule } from "./car/car.module";
import { CarController } from "./car/car.controller.ts";

@Module({
  imports: [CarModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CarController);
  }
}
```

该 `apply()` 方法可以使用单个中间件，也可以使用多个参数来指定多个**多个中间件**。

有时我们想从应用中间件中排除某些路由。我们可以使用该 `exclude()` 方法轻松排除某些路由。此方法可以采用一个字符串，多个字符串或一个 `RouteInfo` 对象来标识要排除的路由，如下所示：

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "car", method: RequestMethod.GET },
    { path: "car", method: RequestMethod.POST },
    "car/(.*)",
  )
  .forRoutes(CatsController);
```

该 `exclude()` 方法使用 `path-to-regexp` 包支持通配符参数。

在上面的示例中，`LoggerMiddleware` 将绑定到内部定义的所有路由，`CarController` 但传递给 `exclude()` 方法的三个路由除外。

#### 函数式中间件

我们使用的 `LoggerMiddleware` 类非常简单。它没有成员，没有额外的方法，没有依赖关系。为什么我们不能只使用一个简单的函数？

这是一个很好的问题，因为事实上 - 我们可以做到。这种类型的中间件称为**函数式中间件**。让我们把 `logger` 转换成函数。

> logger.middleware.ts

```typescript
export function logger(req, res, next) {
  console.log(`Request...`);
  next();
}
```

现在在 `AppModule` 中使用它。

> app.module.ts

```typescript
consumer.apply(logger).forRoutes(CarController);
```

当您的中间件没有任何依赖关系时，我们可以考虑使用函数式中间件。

#### 多个中间件

如前所述，为了绑定顺序执行的多个中间件，我们可以在 `apply()` 方法内用逗号分隔它们。

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CarController);
```

#### 全局中间件

如果我们想一次性将中间件绑定到每个注册路由，我们可以使用由`INestApplication`实例提供的 `use()`方法：

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

### 5. Exception filters

异常过滤器

内置的**异常层**负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。

每个发生的异常都由全局异常过滤器处理, 当这个异常**无法被识别**时 (既不是 `HttpException` 也不是继承的类 `HttpException` ) , 用户将收到以下 `JSON` 响应:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

#### 基础异常类

`Nest`提供了一个内置的 `HttpException` 类，它从 `@nestjs/common` 包中导入。对于典型的基于`HTTP` `REST/GraphQL` `API`的应用程序，最佳实践是在发生某些错误情况时发送标准 HTTP 响应对象。

在 `CarController`，我们有一个 `findAll()` 方法（`GET` 路由）。假设此路由处理程序由于某种原因引发异常。 为了说明这一点，我们将对其进行如下硬编码：

> car.controller.ts

```typescript
@Public()
  @Get('err')
  async getError(): Promise<any> {
    throw new HttpException(' this is an error', HttpStatus.FORBIDDEN);
  }
```

现在当客户端调用这个端点时，响应如下所示：

```tsx
{
    "statusCode": 403,
    "message": "Forbidden"
}
```

`HttpException` 构造函数有两个必要的参数来决定响应:

- `response` 参数定义 `JSON` 响应体。它可以是 `string` 或 `object`，如下所述。
- `status`参数定义`HTTP`[状态代码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)。

默认情况下，`JSON` 响应主体包含两个属性：

- `statusCode`：默认为 `status` 参数中提供的 `HTTP` 状态代码
- `message`:基于状态的 `HTTP` 错误的简短描述

仅覆盖 `JSON` 响应主体的消息部分，请在 `response`参数中提供一个 `string`。

要覆盖整个 `JSON` 响应主体，请在`response` 参数中传递一个`object`。 `Nest`将序列化对象，并将其作为`JSON` 响应返回。

第二个构造函数参数-`status`-是有效的 `HTTP` 状态代码。 最佳实践是使用从`@nestjs/common`导入的 `HttpStatus`枚举。

#### 自定义异常

在许多情况下，您无需编写自定义异常，而可以使用内置的 `Nest HTTP`异常，如下一节所述。 如果确实需要创建自定义的异常，则最好创建自己的**异常层次结构**，其中自定义异常继承自 `HttpException` 基类。 使用这种方法，`Nest`可以识别您的异常，并自动处理错误响应。 让我们实现这样一个自定义异常：

```tsx
export class ForbiddenException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

#### 异常过滤器

如果希望对异常层拥有**完全控制权**，希望基于某些动态因素添加日志记录或者使用不同的 JSON 格式。

异常过滤器可以让我们控制精确的控制流及将响应的内容发送回客户端。

我们来创建一个**异常过滤器**，它负责捕获作为`HttpException`类实例的异常，并为它们设置自定义响应逻辑。

我们需要访问底层平台 `Request`和 `Response`。我们将访问`Request`对象，以便提取原始 `url`并将其包含在日志信息中。我们将使用 `Response.json()`方法，使用 `Response`对象直接控制发送的响应。

> http-exception.filter.ts

```tsx
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

所有异常过滤器都应该实现通用的 `ExceptionFilter<T>` 接口。它需要你使用有效签名提供 `catch(exception: T, host: ArgumentsHost)`方法。`T` 表示异常的类型。

`@Catch()` 装饰器绑定所需的元数据到异常过滤器上。它告诉 `Nest`这个特定的过滤器正在寻找 `HttpException` 而不是其他的。在实践中，`@Catch()` 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤器。

#### 绑定过滤器

将 `HttpExceptionFilter` 绑定到 `CarController` 的 `create()` 方法上。

> car.controller.ts

```typescript
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

在上面的示例中，`HttpExceptionFilter` 仅应用于单个 `create()` 路由处理程序，使其成为方法范围的。 异常过滤器的作用域可以划分为不同的级别：方法范围，控制器范围或全局范围。 例如，要将过滤器设置为控制器作用域，您可以执行以下操作：

> car.controller.ts

```typescript
@UseFilters(new HttpExceptionFilter())
export class CarController {}
```

此结构为 `CatsController` 中的每个路由处理程序设置 `HttpExceptionFilter`。

要创建一个全局范围的过滤器，您需要执行以下操作:

> main.ts

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

该 `useGlobalFilters()` 方法不会为网关和混合应用程序设置过滤器。

全局过滤器用于整个应用程序、每个控制器和每个路由处理程序。就依赖注入而言，从任何模块外部注册的全局过滤器（使用上面示例中的 `useGlobalFilters()`）不能注入依赖，因为它们不属于任何模块。

为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器：

> app.module.ts

```typescript
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

当使用此方法对过滤器执行依赖注入时，请注意，无论采用哪种结构的模块，过滤器实际上都是全局的。

#### 捕获异常

为了捕获每一个未处理的异常(不管异常类型如何)，将 `@Catch()` 装饰器的参数列表设为空，例如 `@Catch()` 。

> any-exception.filter.ts

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

在上面的示例中，过滤器将捕获抛出的每个异常，而不管其类型(类)如何。

### 6.Pipes

管道是具有 `@Injectable()` 装饰器的类。管道应实现 `PipeTransform` 接口。

应用场景

- **transformation** 转换
  - 将输入的数据转换为所需要的数据格式输出
  - 将字符串转换成整数
- **validation** 验证
  - 对输入数据进行验证
  - 如果验证成功继续传递 如果失败则抛出异常

在这两种情况下, 管道 `参数(arguments)` 会由 [控制器(controllers)的路由处理程序](https://docs.nestjs.cn/8/controllers?id=路由参数) 进行处理。Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数,进行转换或是验证处理，然后用转换好或是验证好的参数调用原方法。

Nest 自带很多开箱即用的内置管道。你还可以构建自定义管道。本章将先介绍内置管道以及如何将其绑定到路由处理程序(route handlers)上，然后查看一些自定义管道以展示如何从头开始构建自定义管道。

> 管道在异常区域内运行。这意味着当抛出异常时，它们由核心异常处理程序和应用于当前上下文的 [异常过滤器](https://docs.nestjs.cn/8/exceptionfilters) 处理。当在 Pipe 中发生异常，controller 不会继续执行任何方法。这提供了用于在系统边界验证从外部源进入应用程序的数据的一种最佳实践。

#### 内置管道

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

#### 绑定管道

我们先来快速看看如何使用`ParseIntPipe`。这是一个**转换**的应用场景，管道确保传给路由处理程序的参数是一个整数(若转换失败，则抛出异常)。在本章后面，我们将展示 `ParseIntPipe` 的简单自定义实现。下面的示例写法也适用于其他内置转换管道（`ParseBoolPipe`、`ParseFloatPipe`、`ParseEnumPipe`、`ParseArrayPipe` 和 `ParseUUIDPipe`，我们在本章中将其称为 `Parse*` 管道）。

为了使用管道，我们需要将一个管道类的实例绑定到合适的情境。在我们的 `ParseIntPipe` 示例中，我们希望将管道与特定的路由处理程序方法相关联，并确保它在该方法被调用之前运行。我们使用以下构造来实现，并其称为在方法参数级别绑定管道:

> car.controller.ts

```tsx
	@Get('/:id')
  @Header('Content-Type', 'application/json')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'car id',
  })
  findOne(@Param('id', ParseIntPipe) id: number | string): any {
    return {
      id: id,
      name: '一个车',
    };
  }
```

这确保了我们在 `findOne()` 方法中接收的参数是一个数字(与 `this.catsService.findOne()` 方法的诉求一致)，或者在路由处理程序被调用之前抛出异常。

举个例子，假设路由是这样子的

```
GET localhost:3000/abc
```

Nest 将会抛出这样的异常:

```
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

这个异常阻止了 `findOne()` 方法的执行。

在上述例子中，我们传递了一个类(`ParseIntPipe`)，而不是一个实例，将实例化留给框架去处理，做到了依赖注入。对于管道和守卫，我们也可以选择传递一个实例。如果我们想通过传递选项来自定义内置管道的行为，传递实例很有用：

```typescript
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}

```

绑定其他转换管道(即所有 `Parse*` 管道)的方法类似。这些管道都在验证路由参数、查询字符串参数和请求体正文值的情境中工作。

验证查询字符串参数的例子：

```typescript
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

使用 `ParseUUIDPipe` 解析字符串并验证是否为 UUID 的例子

```typescript
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}
```

当使用 `ParseUUIDPipe()` 时，将解析版本 3、版本 4 或版本 5 的 UUID，如果你只需要特定版本的 UUID，你可以在管道选项中传递版本。

上文我们看到的例子都是绑定不同的 `Parse*` 系列内置管道。绑定验证管道有一些不同；我们将在后续篇章讨论。

#### 自定义管道

虽然 Nest 提供了强大的内置 `ParseIntPipe` 和 `ValidationPipe`，但让我们从头开始构建它们的简单自定义版本，以了解如何构建自定义管道。

先从一个简单的 `ValidationPipe` 开始。最初，我们让它接受一个输入值并立即返回相同的值。

> validation.pipe.ts

```typescript
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

`PipeTransform<T, R>` 是每个管道必须要实现的泛型接口。泛型 `T` 表明输入的 `value` 的类型，`R` 表明 `transfrom()` 方法的返回类型。

为实现 `PipeTransfrom`，每个管道必须声明 `transfrom()` 方法。该方法有两个参数：

- `value`
- `metadata`

`value` 参数是当前处理的方法参数(在被路由处理程序方法接收之前)，`metadata` 是当前处理的方法参数的元数据。元数据对象具有以下属性：

```typescript
export interface ArgumentMetadata {
  type: "body" | "query" | "param" | "custom";
  metatype?: Type<unknown>;
  data?: string;
}
```

这些属性描述了当前处理的参数。

| 参数       | 描述                                                                                                                                             |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`     | 告诉我们参数是一个 body `@Body()`，query `@Query()`，param `@Param()` 还是自定义参数 [在这里阅读更多](https://docs.nestjs.cn/customdecorators)。 |
| `metatype` | 参数的元类型，例如 `String`。 如果在函数签名中省略类型声明，或者使用原生 JavaScript，则为 `undefined`。                                          |
| `data`     | 传递给装饰器的字符串，例如 `@Body('string')`。如果您将括号留空，则为 `undefined`。                                                               |

#### 基于结构的验证

仔细看看 `CarController` 的 `create()` 方法，我们希望在该方法被调用之前，请求主体(post body)得到验证。

```typescript
@Post()
async create(@Body() createCarDto: CreateCarDto) {
  this.carService.create(createCarDto);
}
```

注意到请求体参数为 `createCarDto`，其类型为 `CreateCarDto` :

```tsx
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CrateCarDto {
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly years: number;

  @IsString()
  readonly color: string;

  @IsBoolean()
  @IsOptional()
  readonly isOverload: boolean = false;
}
```

我们希望任何被该方法接收的请求主体都是有效的，因此我们必须验证 `createCarDto` 对象的成员。我们可以在**路由处理程序**方法中执行此操作，但这样做并不理想，因为它会破坏**单一职责原则** (single responsibility rule, SRP)。

另一种做法是**创建一个验证类**，把验证逻辑放在验证类中。这样做的缺点是我们必须要记得在每个该方法的前面，都调用一次验证类。

那么写一个验证中间件呢？可以，但做不到创建一个能在整个应用程序上下文中使用的**通用中间件**。因为中间件不知道**执行上下文**(execution context)，包括将被调用的处理程序及其任何参数。

管道就是为了处理这种应用场景而设计的。让我们继续完善我们的验证管道。

#### 对象结构验证

有几种方法可以实现。一种常见的方式是使用**基于结构**的验证。我们来尝试一下。

[Joi](https://github.com/sideway/joi) 库允许使用可读的 API 以直接的方式创建 schema，让我们构建一个基于 Joi schema 的验证管道。

首先安装依赖：

```bash
$ npm install --save joi
$ npm install --save-dev @types/joi
```

先创建一个简单的 class，在构造函数中传递 schema 参数。然后使用 `schema.validate()` 方法验证参数是否符合提供的 schema。

**验证管道**要么返回该值，要么抛出一个错误。

在下一节中，你将看到我们如何使用 `@UsePipes()` 修饰器给指定的控制器方法提供需要的 schema。这么做能让验证管道跨上下文重用，像我们准备做的那样。

```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ObjectSchema } from "joi";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }
}
```

#### 绑定验证管道

目前为止，已经了解如何绑定转换管道(像 `ParseIntPipe` 和其他 `Parse*` 管道)。

在这种情况下，我们希望在方法调用级别绑定管道。在当前示例中，我们需要执行以下操作使用 `JoiValidationPipe`：

1. 创建一个 `JoiValidationPipe` 实例
2. 传递上下文特定的 Joi schema 给构造函数
3. 绑定到方法

我们用 `@UsePipes()` 装饰器来完成。代码如下:

```typescript
@Post()
@UsePipes(new JoiValidationPipe(createCarSchema))
async create(@Body() createCarDto: CreateCarDto) {
  this.carService.create(createCarDto);
}
```

#### 类验证器

本节中的技术需要 `TypeScript` ，如果您的应用是使用原始 `JavaScript`编写的，则这些技术不可用。

Nest 与 [class-validator](https://github.com/typestack/class-validator) 配合得很好。这个优秀的库允许您使用基于装饰器的验证。装饰器的功能非常强大，尤其是与 Nest 的 **Pipe** 功能相结合使用时，因为我们可以通过访问 `metatype` 信息做很多事情，在开始之前需要安装一些依赖。

```bash
$ npm i --save class-validator class-transformer
```

安装完成后，我们就可以向 `CreateCatDto` 类添加一些装饰器。在这里，我们看到了这种技术实现的一个显著优势：`CreateCatDto` 类仍然是我们的 Post body 对象的单一可靠来源（而不是必须创建一个单独的验证类）。

> create-car.dto.ts

```typescript
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CrateCarDto {
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly years: number;

  @IsString()
  readonly color: string;

  @IsBoolean()
  @IsOptional()
  readonly isOverload: boolean = false;
}
```

现在我们来创建一个 `ValidationPipe` 类。

> validate.pipe.ts

```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // Nest 支持同步和异步管道 解构赋值提取metatype字段
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    // plainToInstance方法将普通的参数对象转换为可验证的对象，必须这样做的原因是传入的post body对象在从网络请求反序列化时不携带任何类型信息。 但 Class-validator 需要使用我们之前为 DTO 定义的验证装饰器，因此我们需要执行此转换，将传入的主体转换为有装饰器的对象，而不仅仅是普通的对象
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    // 这就是一个验证管道，它要么返回值不变，要么抛出异常。
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  // 判断正在处理的参数是原生的javascript类型时，负责绕过验证步骤。
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

首先你会发现 `transform()` 函数是 `异步` 的, Nest 支持**同步**和**异步**管道。这样做的原因是因为有些 `class-validator` 的验证是[可以异步的](https://github.com/typestack/class-validator#custom-validation-classes)(利用 Promise)

接下来请注意，我们正在使用解构赋值提取 metatype 字段（只从 `ArgumentMetadata` 中提取了该成员）赋值给 `metatype` 参数。这是一个先获取全部 `ArgumentMetadata` 然后用附加语句提取某个变量的简写方式。

下一步，请观察 `toValidate()` 方法。当正在处理的参数是原生 JavaScript 类型时，它负责绕过验证步骤（它们不能附加验证装饰器，因此没有理由通过验证步骤运行它们）。

下一步，我们使用 `class-transformer` 的 `plainToInstance()` 方法将普通的 JavaScript 参数对象转换为可验证的类型对象。必须这样做的原因是传入的 post body 对象在从网络请求反序列化时**不携带任何类型信息**（这是底层平台（例如 Express）的工作方式）。 Class-validator 需要使用我们之前为 DTO 定义的验证装饰器，因此我们需要执行此转换，将传入的主体转换为有装饰器的对象，而不仅仅是普通的对象。

最后，如前所述，这就是一个**验证管道**，它要么返回值不变，要么抛出异常。

最后一步是绑定 `ValidationPipe` 。管道可以是参数范围(parameter-scoped)的、方法范围(method-scoped)的、控制器范围的(controller-scoped)或者全局范围(global-scoped)的。

之前，我们已经见到了在方法层面绑定管道的例子，即利用基于 Joi 的验证管道。接下来的例子，我们会将一个管道实例绑定到路由处理程序的 `@Body` 装饰器上，让它能够检验 post body。

> car.controller.ts

```typescript
@Post()
async create(
  @Body(new ValidationPipe()) createCarDto: CreateCarDto,
) {
  this.carService.create(createCarDto);
}
```

当验证逻辑仅涉及一个指定的参数时，参数范围的管道非常有用。

#### 全局管道

由于 `ValidationPipe` 被创建为尽可能通用，所以我们将把它设置为一个**全局作用域**的管道，用于整个应用程序中的每个路由处理器。

> mian.ts

```ts
app.useGlobalPipes(new ValidationPipe());
```

在 [混合应用](https://docs.nestjs.cn/8/faq?id=混合应用)中 `useGlobalPipes()` 方法不会为网关和微服务设置管道, 对于标准(非混合) 微服务应用使用 `useGlobalPipes()` 全局设置管道。

全局管道用于整个应用程序、每个控制器和每个路由处理程序。

就依赖注入而言，从任何模块外部注册的全局管道（即使用了 `useGlobalPipes()`， 如上例所示）无法注入依赖，因为它们不属于任何模块。

为了解决上述问题，可以使用以下构造直接为任何模块设置管道：

> app.module.ts

```typescript
import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

#### 转换的应用场景

验证不是管道唯一的用处。在本章的开始部分，我已经提到管道也可以将输入数据**转换**为所需的输出。这是可以的，因为从 `transform` 函数返回的值完全覆盖了参数先前的值。

在什么时候有用？有时从客户端传来的数据需要经过一些修改（例如字符串转化为整数），然后处理函数才能正确的处理。还有种情况，有些数据的必填字段缺失，那么可以使用默认值。**转换管道**被插入在客户端请求和请求处理程序之间用来处理客户端请求。

这是一个简单的 `ParseIntPipe`，负责将字符串转换为整数。（如上所述，Nest 有一个更复杂的内置 `ParseIntPipe`； 这个例子仅作为自定义转换管道的简单示例）

> parse-int.pipe.ts

```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException("Validation failed");
    }
    return val;
  }
}
```

如下所示, 我们可以很简单的配置管道来处理所参数 id:

```typescript
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.carService.findOne(id);
}
```

#### 提供默认值

`Parse*` 管道期望参数值是被定义的。当接收到 `null` 或者 `undefined` 值时，它们会抛出异常。为了允许端点处理丢失的查询字符串参数值，我们必须在 `Parse*` 管道对这些值进行操作之前注入默认值。`DefaultValuePipe` 提供了这种能力。只需在相关 `Parse*` 管道之前的 `@Query()` 装饰器中实例化 `DefaultValuePipe`，如下所示：

```typescript
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page });
}
```

### 7.Guard

守卫作为一个使用`@Injectable()`装饰器装饰的类，每个守卫应该实现`CanActive`接口。

客户端向服务端发送 http 请求时，守卫负责中间拦截鉴权。他们根据运行时出现的某些条件（例如角色，权限，访问控制列表等）来确定给定的请求是否由路由处理程序处理。

通常也将守卫的执行过程称为鉴权，在传统的 Express 应用程序中，通常由中间件处理授权或者认证逻辑。

中间件是身份验证的良好选择，因为诸如 token 验证或者添加属性到 request 对象上与特定路由没有强关联。

但是中间件不知道调用`next()`函数之后会执行哪个处理程序。守卫就可以。

另一方面，守卫可以访问`ExecutionContext`实例，因此确切的知道接下来要执行什么，他们的设计与异常过滤器 filter、管道 pipe 和拦截器 interceptor 非常相似，目的是让您在请求/响应周期的正确位置插入处理逻辑，并以声明的方式进行插入。这有助于保持代码的简洁和声明性。

#### 执行时机

守卫在每个中间件之后执行，但在任何拦截器之前执行。

#### 授权守卫

授权是守卫的一个很好的实际应用。

只有当调用者具有足够的权限时，特定的路由才可用。我们现在要构建的 AuthGuard 假设用户是经过身份验证的，因此我们假设在 headers 里面有 token，并使用提取的信息来确定用户是否可以继续请求。

> auth.guard.ts

```tsx
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { jwtConstants } from "../config/index";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
```

本例的主要目的是说明守卫如何适应请求/响应周期。

每个守卫必须实现一个 `canActivate()` 函数。此函数应该返回一个布尔值，用于指示是否允许当前请求。它可以同步或异步地返回响应(通过 `Promise` 或 `Observable`)。Nest 使用返回值来控制下一个行为:

- 如果返回 `true`, 将处理用户调用。
- 如果返回 `false`, 则 `Nest` 将忽略当前处理的请求。

#### 执行上下文

`canActivate()` 函数接收单个参数 `ExecutionContext` 实例。`ExecutionContext` 继承自 `ArgumentsHost` 。在异常过滤器章节，我们讲到过 `ArgumentsHost`。在上面的示例中，我们只是使用了之前在 `ArgumentsHost`上定义的帮助器方法来获得对请求对象的引用。

`ExecutionContext` 提供了更多功能，它扩展了 `ArgumentsHost`，但是也提供了有关当前执行进程的更多详细信息。这些细节有助于构建更通用的守卫，这些守卫可以在一系列的控制器、方法和执行上下文中工作。在[这里](https://docs.nestjs.cn/10/fundamentals?id=应用上下文)了解有关 `ExecutionContext` 的更多信息。

#### [基于角色认证](https://docs.nestjs.cn/10/guards?id=基于角色认证)

让我们构建一个功能更强大的守卫，它只允许具有特定角色的用户访问。我们将从一个基本的守卫模板开始，并在接下来的部分中以它为基础。

> roles.guard.ts

```typescript
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

#### 绑定守卫

与管道和异常过滤器一样，守卫可以是控制范围的、方法范围的或全局范围的。

1. 控制范围

- 使用 `@UseGuards()`装饰器设置了一个控制范围的守卫使用 `@UseGuards()`装饰器设置了一个控制范围的守卫。
- 这个装饰器可以使用单个参数，也可以使用逗号分隔的参数列表。也就是说，你可以传递几个守卫并用逗号分隔它们。

```typescript
@Controller("car")
@UseGuards(RolesGuard)
export class CarController {}
```

上例，我们已经传递了 `RolesGuard` 类型而不是实例, 让框架进行实例化，并启用了依赖注入。与管道和异常过滤器一样，我们也可以传递一个实例

```typescript
@Controller("car")
@UseGuards(new RolesGuard())
export class CarController {}
```

上面的构造将守卫附加到此控制器声明的每个处理程序。如果我们希望守卫只应用于单个方法，则需在**方法级别**应用 `@UseGuards()` 装饰器。

2. 全局守卫

为了设置一个全局守卫，使用 Nest 应用程序实例的 `useGlobalGuards()` 方法。

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

全局守卫用于整个应用程序, 每个控制器和每个路由处理程序。在依赖注入方面, 从任何模块外部注册的全局守卫 (使用 `useGlobalGuards()`，如上面的示例中所示)不能插入依赖项, 因为它们不属于任何模块。为了解决此问题, 您可以使用以下构造直接从任何模块设置一个守卫:

> app.module.ts

```typescript
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

#### 为每个处理器设置角色

我们的 `RolesGuard` 现在在正常工作，但还不是很智能。我们仍然没有利用最重要的守卫的特征，即**执行上下文**。它还不知道角色，或者每个处理程序允许哪些角色。例如，`CarController` 可以为不同的路由提供不同的权限方案。其中一些可能只对管理用户可用，而另一些则可以对所有人开放。我们如何以灵活和可重用的方式将角色与路由匹配起来?

这就是自定义元数据发挥作用的地方(从[这里](https://docs.nestjs.cn/10/fundamentals?id=反射和元数据)了解更多)。`Nest` 提供了通过 `@SetMetadata()` 装饰器将定制元数据附加到路由处理程序的能力。这些元数据提供了我们所缺少的角色数据，而守卫需要这些数据来做出决策。让我们看看使用`@SetMetadata()`:

> car.controller.ts

```typescript
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCarDto: CreateCarDto) {
  this.carService.create(createCarDto);
}
```

`@SetMetadata()` 装饰器需要从 `@nestjs/common` 包导入。

通过上面的构建，我们将 `roles` 元数据(`roles` 是一个键，而 `['admin']` 是一个特定的值)附加到 `create()` 方法。虽然这样可以运行，但直接使用 `@SetMetadata()` 并不是一个好做法。相反，你应该创建你自己的装饰器。

> roles.decorator.ts

```typescript
import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

这种方法更简洁、更易读，而且是强类型的。现在我们有了一个自定义的 `@Roles()` 装饰器，我们可以使用它来装饰 `create()`方法。

> car.controller.ts

```typescript
@Post()
@Roles('admin')
async create(@Body() createCarDto: CreateCarDto) {
  this.carService.create(createCarDto);
}
```

现在我们来处理一下`RolesGuard` 。 它只是在所有情况下返回 `true`，到目前为止允许请求继续。我们希望根据分配给当前用户的角色与正在处理的当前路由所需的实际角色之间的比较来设置返回值的条件。 为了访问路由的角色(自定义元数据)，我们将使用在 `@nestjs/core` 中提供的 `Reflector` 帮助类。

> roles.guard.ts

```ts
import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[] | undefined>(
      "roles",
      [
        context.getHandler(), // Method Roles
        context.getClass(), // Controller Roles
      ],
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) {
      return false;
    }
    // 当守卫返回 false 时，框架会抛出一个 ForbiddenException 异常
    return user.roles.some((role: string) => roles.includes(role));
  }
}
```

#### 异常处理

查阅**执行上下文**章节的[反射和元数据]部分，以了解如何以上下文相关(context-sensitive)的方式利用 `Reflector` 。

当权限不足的用户请求端点时，Nest 会自动返回以下响应：

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

其背后的原理是，当守卫返回 `false` 时，框架会抛出一个 `ForbiddenException` 异常。如果您想要返回不同的错误响应，你应该抛出一个你自己的准确声明的异常。

```typescript
throw new UnauthorizedException();
```

由守卫引发的任何异常都将由[异常层](https://docs.nestjs.cn/10/exceptionfilters)(全局异常过滤器和应用于当前上下文的任何异常过滤器)处理。

### 8.Interceptor

拦截器是使用 `@Injectable()` 装饰器注解的类。

拦截器应该实现 `NestInterceptor` 接口。

拦截器的功能受面向切面编程（AOP）技术的启发。

- 在函数执行之前/之后绑定**额外的逻辑**
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展函数的基本行为
- 根据所选条件完全重写函数（例如，缓存目的）

#### 基础

每个拦截器都有`intercept()`方法，他接受两个参数。

第一个是 `ExecutionContext` 实例（与守卫完全相同的对象）。 `ExecutionContext` 继承自 `ArgumentsHost` 。 `ArgumentsHost` 是传递给原始处理程序的参数的一个包装 ，它根据应用程序的类型包含不同的参数数组。

第二个参数是 `CallHandler`。`CallHandler` 接口实现了`handle() `方法，您可以使用该方法在拦截器中的某个时刻调用路由处理程序方法。

这种方法意味着 `intercept()`方法有效的包装了请求/响应流。因此，您可以在最终**路由处理程序执行之前和之后**实现自定义逻辑。

很明显，你可以在 handle 方法调用之前的`intercept()`方法中写执行之前的逻辑， but how do you affect what happens afterward? 但是你如何影响之后发生的逻辑呢？

因为 handle()方法返回一个 Observable，我们可以使用强大的 RxJS 运算符来进一步操作响应。路由处理程序的调用（即调用 handle()）称为切入点，表示这是我们插入附加逻辑的点。

看下面的例子

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class BeforeAfterInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log("Before Function Execution...");

    return next
      .handle()
      .pipe(tap(() => console.log("After Function Execution")));
  }
}
```

比方说，有人提出了 POST `/cats` 请求。此请求指向在 `CatsController` 中定义的 `create()` 处理程序。如果在此过程中未调用拦截器的 `handle()` 方法，则 `create()` 方法不会被计算。

只有 `handle()` 被调用（并且已返回值），最终方法才会被触发。为什么？

因为 Nest 订阅了返回的流，并使用此流生成的值来为最终用户创建单个响应或多个响应。而且，`handle()` 返回一个 `Observable`，这意味着它为我们提供了一组非常强大的运算符，可以帮助我们进行例如响应操作。

#### 截取切面

Aspect interception

使用拦截器记录用户交互

使用拦截器在函数执行之前或之后添加额外的逻辑

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

`NestInterceptor<T, R>` 是一个通用接口，其中 `T` 表示已处理的 `Observable<T>` 的类型（在流后面），而 `R` 表示包含在返回的 `Observable<R>` 中的值的返回类型。

拦截器的作用与控制器，提供程序，守卫等相同，这意味着它们可以通过构造函数注入依赖项。

由于 `handle()` 返回一个 RxJS `Observable`，我们有很多种操作符可以用来操作流。在上面的例子中，我们使用了 `tap()` 运算符，该运算符在可观察序列的正常或异常终止时调用函数。

#### 绑定拦截器

为了设置拦截器, 我们使用从 `@nestjs/common` 包导入的 `@UseInterceptors()` 装饰器。与守卫一样, 拦截器可以是控制器范围内的, 方法范围内的或者全局范围内的。

> car.controller.ts

```typescript
@UseInterceptors(LoggingInterceptor)
export class CarController {}
```

`@UseInterceptors()` 装饰器从 `@nestjs/common` 导入。

由此，`CarController` 中定义的每个路由处理程序都将使用 `LoggingInterceptor`。当有人调用 GET `/cats` 端点时，您将在控制台窗口中看到以下输出：

```json
Before...
After... 1ms
```

请注意，我们传递的是 `LoggingInterceptor` 类型而不是实例，让框架承担实例化责任并启用依赖注入。另一种可用的方法是传递立即创建的实例：

> car.controller.ts

```typescript
@UseInterceptors(new LoggingInterceptor())
export class CarController {}
```

如上所述, 上面的构造将拦截器附加到此控制器声明的每个处理程序。如果我们决定只限制其中一个, 我们只需在**方法级别**设置拦截器。

为了绑定全局拦截器, 我们使用 Nest 应用程序实例的 `useGlobalInterceptors()` 方法:

```typescript
const app = await NestFactory.create(ApplicationModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

全局拦截器用于整个应用程序、每个控制器和每个路由处理程序。在依赖注入方面, 从任何模块外部注册的全局拦截器 (如上面的示例中所示) 无法插入依赖项, 因为它们不属于任何模块。为了解决此问题, 您可以使用以下构造**直接从任何模块**设置一个拦截器:

> app.module.ts

```typescript
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

#### 响应映射

我们已经知道, `handle()` 返回一个 `Observable`，该流包含从路由处理程序返回的值，因此我们可以使用 RxJS 的 map() 运算符轻松地改变它。

让我们创建一个 TransformInterceptor, 它将打包响应并将其分配给 data 属性。

> transform.interceptor.ts

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
```

之后，当有人调用 GET `/car/create`时，请求将如下所示（我们假设路由处理程序返回一个空 arry `[]`）：

```json
{
  "data": []
}
```

拦截器在创建用于整个应用程序的可重用解决方案时具有巨大的潜力。例如，我们假设我们需要将每个发生的 `null` 值转换为空字符串 `''`。我们可以使用一行代码并将拦截器绑定为全局代码。由于这一点，它会被每个注册的处理程序自动重用。

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => (value === null ? "" : value)));
  }
}
```

#### 异常映射

另一个有趣的用例是利用 `catchError()` 操作符来覆盖抛出的异常：

> exception.interceptor.ts

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((err) => throwError(new BadGatewayException())));
  }
}
```

#### [Stream 重写](https://docs.nestjs.cn/10/interceptors?id=stream-重写)

完全阻止调用处理程序并返回不同的值。

由于性能问题而从缓存中获取。

这是有多种原因的。

一个很好的例子是**缓存拦截器**，它将使用一些 TTL 存储缓存的响应。让我们看一下一个简单的缓存拦截器，它从缓存返回其响应。在实际示例中，我们需要考虑其他因素，例如 TTL、缓存失效、缓存大小等，但这超出了本次讨论的范围。

> cache.interceptor.ts

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, of } from "rxjs";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
```

这是一个 `CacheInterceptor`，带有硬编码的 `isCached` 变量和硬编码的响应 `[]` 。我们在这里通过 `of` 运算符创建并返回了一个新的流, 因此路由处理程序**根本不会被调用**。当有人调用使用 `CacheInterceptor` 的端点时, 响应 (一个硬编码的空数组) 将立即返回。为了创建一个通用解决方案, 您可以利用 `Reflector` 并创建自定义修饰符。反射器 `Reflector` 在守卫章节描述的很好。

### 9.Custom route decorators

自定义路由装饰器

Nest 是围绕一种称为**decorators**的语言功能构建的。

在很多常见的编程语言中，装饰器是一个广为人知的概念，但在 `JavaScript` 世界中，这个概念仍然相对较新。

这是关于**decorators**的一个简单的定义：

> An ES2016 decorator is an expression which returns a function and can take a target, name and property descriptor as arguments. You apply it by prefixing the decorator with an `@` character and placing this at the very top of what you are trying to decorate. Decorators can be defined for either a class, a method or a property.

一个 ES2016 装饰器是一个返回函数的表达式，它可以接受目标（target）、名称（name）和属性描述符（property descriptor）作为参数。你可以通过在装饰器前面加上 @ 字符，并将其放置在你要装饰的对象的顶部来应用它。装饰器可以定义在类、方法或属性上。

装饰器是一个表达式，它返回一个可以将目标、名称和属性描述符作为参数的函数。

通过在装饰器前面添加一个 `@` 字符并将其放置在你要装饰的内容的最顶部来应用它。可以为类、方法或属性定义装饰器。

#### 参数装饰器

`Nest` 提供了一组非常实用的参数装饰器，可以结合 `HTTP` 路由处理器（`route handlers`）一起使用。下面的列表展示了`Nest` 装饰器和原生 `Express`（或 `Fastify`）中相应对象的映射。

|                            |                                    |
| :------------------------- | :--------------------------------- |
| `@Request(), @Req()`       | `req`                              |
| `@Response(), @Res()`      | `res`                              |
| `@Next()`                  | `next`                             |
| `@Session()`               | `req.session`                      |
| `@Param(param?: string)`   | `req.params / req.params[param]`   |
| `@Body(param?: string)`    | `req.body / req.body[param]`       |
| `@Query(param?: string)`   | `req.query / req.query[param]`     |
| `@Headers(param?: string)` | `req.headers / req.headers[param]` |
| `@Ip()`                    | `req.ip`                           |
| `@HostParam()`             | `req.hosts`                        |

另外，你还可以创建**自定义装饰器**。这非常有用。

在 `Node.js` 中，会经常将需要传递的值加到请求对象的属性中。然后在每个路由处理程序中手动提取它们，使用如下代码：

const user = req.user;

为了使代码更具可读性和透明性，我们可以创建一个 `@User()` 装饰器并在所有控制器中使用它。

> user.decorator.ts

```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

现在你可以在任何你想要的地方很方便地使用它。

```typescript
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

#### 传递数据

当装饰器的行为取决于某些条件时，可以使用 `data` 参数将参数传递给装饰器的工厂函数。 一个用例是自定义装饰器，它通过键从请求对象中提取属性。 例如，假设我们的身份验证层验证请求并将用户实体附加到请求对象。 经过身份验证的请求的用户实体可能类似于：

```json
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

让我们定义一个将属性名作为键的装饰器，如果存在则返回关联的值（如果不存在或者尚未创建 `user` 对象，则返回 undefined）。

> user.decorator.ts

```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user && user[data] : user;
  },
);
```

然后，您可以通过控制器中的 `@User()` 装饰器访问以下特定属性：

```typescript
@Get()
async findOne(@User('firstName') firstName: string) {
  console.log(`Hello ${firstName}`);
}
```

您可以使用具有不同键的相同装饰器来访问不同的属性。如果用户对象复杂，使用此方法可以使请求处理程序编写更容易、并且可读性更高。

> 对于 `TypeScript` 用户，请注意这 `createParamDecorator<T>()` 是通用的。这意味着您可以显式实施类型安全性，例如 `createParamDecorator<string>((data, ctx) => ...)`或者，在工厂函数中指定参数类型，例如`createParamDecorator((data: string, ctx) => ...)` 。如果省略这两个， 参数 `data` 的类型为 `any`。

#### 使用管道

`Nest` 对待自定义的路由参数装饰器和自身内置的装饰器（`@Body()`，`@Param()` 和 `@Query()`）一样。这意味着管道也会因为自定义注释参数（在本例中为 `user` 参数）而被执行。此外，你还可以直接将管道应用到自定义装饰器上：

```typescript
@Get()
async findOne(@User(new ValidationPipe()) user: UserEntity) {
  console.log(user);
}
```

> 请注意，`validateCustomDecorators` 选项必须设置为 `true`。默认情况下，`ValidationPipe` 不验证使用自定义装饰器注释的参数。

#### 装饰器聚合

`Nest` 提供了一种辅助方法来聚合多个装饰器。例如，假设您要将与身份验证相关的所有装饰器聚合到一个装饰器中。这可以通过以下方法实现：

```typescript
import { applyDecorators } from "@nestjs/common";

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  );
}
```

然后，你可以参照以下方式使用 `@Auth()` 自定义装饰器：

```typescript
@Get('users')
@Auth('admin')
findAllUsers() {}
```

这具有通过一个声明应用所有四个装饰器的效果。

> @nestjs/swagger 包中的 @ApiHideProperty() 装饰器不可聚合，并且无法与 applyDecorators 函数一起正常工作。
