---
title: Transformers and Validators
has_children: false
nav_order: 8
---

# Transformers

A transformer is a provider class decorated with the `@Transformer()` decorator.
The class, though, must implement the `TransformerHandler` interface.

![Transformers](images/transformers.png)

```typescript
@Transformer()
export class TestTransformer implements TransformerHandler {
  transform(value: unknown): unknown | Promise<unknown> {
    return `Adding some text: ${value}`;
  }
}
```

Transformers can be applied to the following route parameters decorators:

- `@Param(key: string, transformer?: TransformerClass)`
- `@Query(key: string, transformer?: TransformerClass)`
- `@Header(key: string, transformer?: TransformerClass)`
- `@Body(transformer?: TransformerClass)`

```typescript
@Controller('/test')
export class TestController {
  
  @Get('/transformer')
  async transformer(@Query('testTransformer', TestTransformer) param: string) {
    return param;
  }
}
```

# Validation

Transformers can also suite the role of validators and errors can be thrown from its.

```typescript
@Transformer()
export class NumberTransform implements TransformerHandler {
  transform(value: unknown): unknown | Promise<unknown> {
    if (!isNumber(value)) {
      throw new BadRequestException({ error: { }, message: 'Not a number' })
    }
    
    return parseInt(value);
  }
}
```

# Built-in transformers and validators

| Component      | Type                   | Description                                                                                                                                  |
|----------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| `@ToString()`  | Transformer            | It converts the received into string                                                                                                         |
| `@ToNumber()`  | Transformer, Validator | It checks if the value can be converted into a number and eventually converts it. It can throw a `BadRequestException`.                      |
| `@ToBoolean()` | Transformer, Validator | It checks if the value can be converted into a boolean (true, 1, false, 0) and eventually converts it. It can throw a `BadRequestException`. |
