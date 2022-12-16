// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode } from 'graphql';

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

export type Query = {
  averageFuelUsage: Scalars['Float'];
  cars: Array<Scalars['String']>;
  fuelUsage: Array<Scalars['Float']>;
  isAverageUsageReliable: Scalars['Boolean'];
  lastFuelUsage?: Maybe<Scalars['Float']>;
  tracksForCar: Array<Scalars['String']>;
  currentDriver?: Maybe<Driver>;
};


export type QueryaverageFuelUsageArgs = {
  input: FuelUsageInputType;
};


export type QueryfuelUsageArgs = {
  input: FuelUsageInputType;
};


export type QueryisAverageUsageReliableArgs = {
  input: FuelUsageInputType;
};


export type QuerylastFuelUsageArgs = {
  input: FuelUsageInputType;
};


export type QuerytracksForCarArgs = {
  carName: Scalars['String'];
};

export type FuelUsageInputType = {
  carName: Scalars['String'];
  track: Scalars['String'];
};

export type Subscription = {
  legacySubscription?: Maybe<LegacySubscriptionPayload>;
};


export type SubscriptionlegacySubscriptionArgs = {
  input: LegacySubscriptionInput;
};

export type Driver = {
  carIndex: Scalars['Int'];
  carNumber?: Maybe<Scalars['String']>;
  carNumberRaw?: Maybe<Scalars['Int']>;
  userId: Scalars['Int'];
  userName: Scalars['String'];
  teamId?: Maybe<Scalars['Int']>;
  teamName?: Maybe<Scalars['String']>;
};

export type LegacySubscriptionInput = {
  fps: Scalars['Int'];
  requestParameters: Array<Scalars['String']>;
  requestParametersOnce?: InputMaybe<Array<Scalars['String']>>;
  readIBT: Scalars['Boolean'];
};

export type LegacySubscriptionPayload = {
  data: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
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
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  FuelUsageInputType: FuelUsageInputType;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Subscription: ResolverTypeWrapper<{}>;
  Driver: ResolverTypeWrapper<Driver>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  LegacySubscriptionInput: LegacySubscriptionInput;
  LegacySubscriptionPayload: ResolverTypeWrapper<LegacySubscriptionPayload>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  FuelUsageInputType: FuelUsageInputType;
  String: Scalars['String'];
  Float: Scalars['Float'];
  Boolean: Scalars['Boolean'];
  Subscription: {};
  Driver: Driver;
  Int: Scalars['Int'];
  LegacySubscriptionInput: LegacySubscriptionInput;
  LegacySubscriptionPayload: LegacySubscriptionPayload;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  averageFuelUsage?: Resolver<ResolversTypes['Float'], ParentType, ContextType, RequireFields<QueryaverageFuelUsageArgs, 'input'>>;
  cars?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  fuelUsage?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType, RequireFields<QueryfuelUsageArgs, 'input'>>;
  isAverageUsageReliable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryisAverageUsageReliableArgs, 'input'>>;
  lastFuelUsage?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType, RequireFields<QuerylastFuelUsageArgs, 'input'>>;
  tracksForCar?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QuerytracksForCarArgs, 'carName'>>;
  currentDriver?: Resolver<Maybe<ResolversTypes['Driver']>, ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  legacySubscription?: SubscriptionResolver<Maybe<ResolversTypes['LegacySubscriptionPayload']>, "legacySubscription", ParentType, ContextType, RequireFields<SubscriptionlegacySubscriptionArgs, 'input'>>;
}>;

export type DriverResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Driver'] = ResolversParentTypes['Driver']> = ResolversObject<{
  carIndex?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  carNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  carNumberRaw?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  teamId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  teamName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LegacySubscriptionPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['LegacySubscriptionPayload'] = ResolversParentTypes['LegacySubscriptionPayload']> = ResolversObject<{
  data?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Driver?: DriverResolvers<ContextType>;
  LegacySubscriptionPayload?: LegacySubscriptionPayloadResolvers<ContextType>;
}>;


import { MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';

import { InContextSdkMethod } from '@graphql-mesh/types';


    export namespace FuelTypes {
      export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FuelUsageInputType = {
  carName: Scalars['String'];
  track: Scalars['String'];
};

export type Query = {
  averageFuelUsage: Scalars['Float'];
  cars: Array<Scalars['String']>;
  fuelUsage: Array<Scalars['Float']>;
  isAverageUsageReliable: Scalars['Boolean'];
  lastFuelUsage?: Maybe<Scalars['Float']>;
  tracksForCar: Array<Scalars['String']>;
};


export type QueryaverageFuelUsageArgs = {
  input: FuelUsageInputType;
};


export type QueryfuelUsageArgs = {
  input: FuelUsageInputType;
};


export type QueryisAverageUsageReliableArgs = {
  input: FuelUsageInputType;
};


export type QuerylastFuelUsageArgs = {
  input: FuelUsageInputType;
};


export type QuerytracksForCarArgs = {
  carName: Scalars['String'];
};

    }
    export type QueryFuelSdk = {
  /** null **/
  averageFuelUsage: InContextSdkMethod<FuelTypes.Query['averageFuelUsage'], FuelTypes.QueryaverageFuelUsageArgs, MeshContext>,
  /** null **/
  cars: InContextSdkMethod<FuelTypes.Query['cars'], {}, MeshContext>,
  /** null **/
  fuelUsage: InContextSdkMethod<FuelTypes.Query['fuelUsage'], FuelTypes.QueryfuelUsageArgs, MeshContext>,
  /** null **/
  isAverageUsageReliable: InContextSdkMethod<FuelTypes.Query['isAverageUsageReliable'], FuelTypes.QueryisAverageUsageReliableArgs, MeshContext>,
  /** null **/
  lastFuelUsage: InContextSdkMethod<FuelTypes.Query['lastFuelUsage'], FuelTypes.QuerylastFuelUsageArgs, MeshContext>,
  /** null **/
  tracksForCar: InContextSdkMethod<FuelTypes.Query['tracksForCar'], FuelTypes.QuerytracksForCarArgs, MeshContext>
};

export type MutationFuelSdk = {

};

export type SubscriptionFuelSdk = {

};


    export namespace TelemetryTypes {
      export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Driver = {
  carIndex: Scalars['Int'];
  carNumber?: Maybe<Scalars['String']>;
  carNumberRaw?: Maybe<Scalars['Int']>;
  userId: Scalars['Int'];
  userName: Scalars['String'];
  teamId?: Maybe<Scalars['Int']>;
  teamName?: Maybe<Scalars['String']>;
};

export type Query = {
  currentDriver?: Maybe<Driver>;
};

export type LegacySubscriptionInput = {
  fps: Scalars['Int'];
  requestParameters: Array<Scalars['String']>;
  requestParametersOnce?: InputMaybe<Array<Scalars['String']>>;
  readIBT: Scalars['Boolean'];
};

export type LegacySubscriptionPayload = {
  data: Scalars['String'];
};

export type Subscription = {
  legacySubscription?: Maybe<LegacySubscriptionPayload>;
};


export type SubscriptionlegacySubscriptionArgs = {
  input: LegacySubscriptionInput;
};

    }
    export type QueryTelemetrySdk = {
  /** null **/
  currentDriver: InContextSdkMethod<TelemetryTypes.Query['currentDriver'], {}, MeshContext>
};

export type MutationTelemetrySdk = {

};

export type SubscriptionTelemetrySdk = {
  /** null **/
  legacySubscription: InContextSdkMethod<TelemetryTypes.Subscription['legacySubscription'], TelemetryTypes.SubscriptionlegacySubscriptionArgs, MeshContext>
};

export type FuelContext = {
      ["Fuel"]: { Query: QueryFuelSdk, Mutation: MutationFuelSdk, Subscription: SubscriptionFuelSdk },
    };

export type TelemetryContext = {
      ["Telemetry"]: { Query: QueryTelemetrySdk, Mutation: MutationTelemetrySdk, Subscription: SubscriptionTelemetrySdk },
    };

export type MeshContext = FuelContext & TelemetryContext & BaseMeshContext;


import { getMesh } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { fileURLToPath } from '@graphql-mesh/utils';
import ExternalModule_0 from '@graphql-mesh/cache-inmemory-lru';
import ExternalModule_1 from '@graphql-mesh/graphql';
import ExternalModule_2 from '@graphql-mesh/merger-stitching';
import ExternalModule_3 from './sources/Fuel/introspectionSchema';
import ExternalModule_4 from './sources/Telemetry/introspectionSchema';

const importedModules: Record<string, any> = {
  // @ts-ignore
  ["@graphql-mesh/cache-inmemory-lru"]: ExternalModule_0,
  // @ts-ignore
  ["@graphql-mesh/graphql"]: ExternalModule_1,
  // @ts-ignore
  ["@graphql-mesh/merger-stitching"]: ExternalModule_2,
  // @ts-ignore
  [".mesh/sources/Fuel/introspectionSchema"]: ExternalModule_3,
  // @ts-ignore
  [".mesh/sources/Telemetry/introspectionSchema"]: ExternalModule_4
};

const baseDir = pathModule.join(__dirname, '..');

const importFn = (moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  if (!(relativeModuleId in importedModules)) {
    throw new Error(`Cannot find module '${relativeModuleId}'.`);
  }
  return Promise.resolve(importedModules[relativeModuleId]);
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: 'ts',
}), {
  readonly: true,
  validate: false
});

import { GetMeshOptions } from '@graphql-mesh/runtime';
import { YamlConfig } from '@graphql-mesh/types';
import { parse } from 'graphql';
import { PubSub } from '@graphql-mesh/utils';
import MeshCache from '@graphql-mesh/cache-inmemory-lru';
import { DefaultLogger } from '@graphql-mesh/utils';
import GraphqlHandler from '@graphql-mesh/graphql'
import StitchingMerger from '@graphql-mesh/merger-stitching';
import { resolveAdditionalResolvers } from '@graphql-mesh/utils';
import { parseWithCache } from '@graphql-mesh/utils';
export const rawConfig: YamlConfig.Config = {"sources":[{"name":"Telemetry","handler":{"graphql":{"endpoint":"http://0.0.0.0:5001/graphql"}}},{"name":"Fuel","handler":{"graphql":{"endpoint":"http://0.0.0.0:5002/graphql"}}}],"serve":{"port":5000,"playground":true,"playgroundTitle":"iRacing GraphQL"}} as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const cache = new (MeshCache as any)({
      ...(rawConfig.cache || {}),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
    } as any)
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger('🕸️');
const sources = [];
const transforms = [];
const telemetryTransforms = [];
const fuelTransforms = [];
const additionalTypeDefs = [] as any[];
const telemetryHandler = new GraphqlHandler({
              name: rawConfig.sources[0].name,
              config: rawConfig.sources[0].handler["graphql"],
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child(rawConfig.sources[0].name),
              logger: logger.child(rawConfig.sources[0].name),
              importFn
            });
const fuelHandler = new GraphqlHandler({
              name: rawConfig.sources[1].name,
              config: rawConfig.sources[1].handler["graphql"],
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child(rawConfig.sources[1].name),
              logger: logger.child(rawConfig.sources[1].name),
              importFn
            });
sources.push({
          name: 'Telemetry',
          handler: telemetryHandler,
          transforms: telemetryTransforms
        })
sources.push({
          name: 'Fuel',
          handler: fuelHandler,
          transforms: fuelTransforms
        })
const merger = new(StitchingMerger as any)({
        cache,
        pubsub,
        logger: logger.child('StitchingMerger'),
        store: rootStore.child('stitchingMerger')
      })
const additionalResolversRawConfig = [];
const additionalResolvers = await resolveAdditionalResolvers(
      baseDir,
      additionalResolversRawConfig,
      importFn,
      pubsub
  )
const liveQueryInvalidations = rawConfig.liveQueryInvalidations;
const additionalEnvelopPlugins = [];
const documents = documentsInSDL.map((documentSdl: string, i: number) => ({
              rawSDL: documentSdl,
              document: parseWithCache(documentSdl),
              location: `document_${i}.graphql`,
            }))

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    liveQueryInvalidations,
    additionalEnvelopPlugins,
    documents,
  };
}

export const documentsInSDL = /*#__PURE__*/ [];

export async function getBuiltMesh(): Promise<MeshInstance<MeshContext>> {
  const meshConfig = await getMeshOptions();
  return getMesh<MeshContext>(meshConfig);
}

export async function getMeshSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const { sdkRequesterFactory } = await getBuiltMesh();
  return getSdk<TOperationContext>(sdkRequesterFactory(globalContext));
}

export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;