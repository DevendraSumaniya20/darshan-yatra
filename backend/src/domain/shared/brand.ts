declare const brand: unique symbol;

/** Nominal typing for primitives, so a yatra id cannot be passed where a departure id is expected. */
export type Brand<T, Name extends string> = T & { readonly [brand]: Name };
