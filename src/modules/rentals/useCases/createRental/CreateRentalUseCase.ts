interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_data: Date;
}

class CreateRentalUseCase {
  constructor(private rentalsRepository: IRentalsRepository);
  async execute({
    user_id,
    car_id,
    expected_return_data,
  }: IRequest): Promise<void> {}
}

export { CreateRentalUseCase };
