import { ClassDeclaration } from 'typescript'

export * from './chess'

export type Active = 'active' | 'inactive'

export type Activity = {
    activity: ClassDeclaration
}