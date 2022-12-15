import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Driver = {
  __typename?: 'Driver';
  carIndex: Scalars['Int'];
  carNumber?: Maybe<Scalars['String']>;
  carNumberRaw?: Maybe<Scalars['Int']>;
  teamId?: Maybe<Scalars['Int']>;
  teamName?: Maybe<Scalars['String']>;
  userId: Scalars['Int'];
  userName: Scalars['String'];
};

export type LegacySubscriptionInput = {
  fps: Scalars['Int'];
  readIBT: Scalars['Boolean'];
  requestParameters: Array<Scalars['String']>;
  requestParametersOnce?: InputMaybe<Array<Scalars['String']>>;
};

export type LegacySubscriptionPayload = {
  __typename?: 'LegacySubscriptionPayload';
  data: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  currentDriver?: Maybe<Driver>;
};

export type Subscription = {
  __typename?: 'Subscription';
  legacySubscription?: Maybe<LegacySubscriptionPayload>;
};

export type SubscriptionLegacySubscriptionArgs = {
  input: LegacySubscriptionInput;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Driver: ResolverTypeWrapper<Driver>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LegacySubscriptionInput: LegacySubscriptionInput;
  LegacySubscriptionPayload: ResolverTypeWrapper<LegacySubscriptionPayload>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Driver: Driver;
  Int: Scalars['Int'];
  LegacySubscriptionInput: LegacySubscriptionInput;
  LegacySubscriptionPayload: LegacySubscriptionPayload;
  Query: {};
  String: Scalars['String'];
  Subscription: {};
};

export type DriverResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Driver'] = ResolversParentTypes['Driver'],
> = {
  carIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  carNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  carNumberRaw?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  teamName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LegacySubscriptionPayloadResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['LegacySubscriptionPayload'] = ResolversParentTypes['LegacySubscriptionPayload'],
> = {
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  currentDriver?: Resolver<Maybe<ResolversTypes['Driver']>, ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = {
  legacySubscription?: SubscriptionResolver<
    Maybe<ResolversTypes['LegacySubscriptionPayload']>,
    'legacySubscription',
    ParentType,
    ContextType,
    RequireFields<SubscriptionLegacySubscriptionArgs, 'input'>
  >;
};

export type Resolvers<ContextType = any> = {
  Driver?: DriverResolvers<ContextType>;
  LegacySubscriptionPayload?: LegacySubscriptionPayloadResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
};
