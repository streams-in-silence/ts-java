/**
 * This interface imposes a total ordering on the objects of each class that implements it.
 * This ordering is referred to as the class's natural ordering, and the object's compareTo method is referred to as
 * its natural comparison method.
 */
export interface Comparable<T> {
  /**
   * Compares this object with the specified object for order.
   * @param other the object to be compared.
   * @returs a negative integer, zero, or a positive integer as this object is less than, equal to, or greater than the specified object.
   */
  compareTo(other: T): number;
}
