
declare module 'apollo-datasource-mongodb' {
  import { ObjectId } from "bson"

  export class MongoDataSource<T> {
    findOneById(id: ObjectId): T
    findManyByIds(arrayOfIds: Array<ObjectId>): Array<T>
  }
}