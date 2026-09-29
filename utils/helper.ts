import { RandomDataUtil } from './dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

export class Helper {
  static convertPriceToNumber(price: string): number {
    const cleaned = price.replace(/[^0-9.]/g, '');
    return Number(cleaned);
  }

  static getProductDetails() {
    return {
      productName: "MacBook",
      productQuantity: "1",
      totalPrice: "$602.00",
    };
  }

  static getLoginDetails() {
    return {
      email: "juliet123@gmail.com",
      password: "test@123",
    };
  }

  static getRegistrationData() {
    return {
      firstname: RandomDataUtil.getFirstName(),
      lastname: RandomDataUtil.getLastName(),
      email: RandomDataUtil.getEmail(),
      telephone: RandomDataUtil.getPhoneNumber(),
      password: 'test@123',
    };
  }
}