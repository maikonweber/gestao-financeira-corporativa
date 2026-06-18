import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getLoggerToken } from 'nestjs-pino';
import { createMockLogger } from '../testing/pino-logger.mock';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  const repository = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findByIdAndUser: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesRepository, useValue: repository },
        {
          provide: getLoggerToken(CategoriesService.name),
          useValue: createMockLogger(),
        },
      ],
    }).compile();

    categoriesService = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  it('should create a category for the user', async () => {
    repository.create.mockResolvedValue({
      id: 'cat-1',
      userId: 'user-1',
      name: 'Office',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await categoriesService.create('user-1', {
      name: 'Office',
    });

    expect(result.name).toBe('Office');
    expect(repository.create).toHaveBeenCalledWith('user-1', { name: 'Office' });
  });

  it('should throw NotFoundException when category does not belong to user', async () => {
    repository.findByIdAndUser.mockResolvedValue(null);

    await expect(
      categoriesService.findOne('user-1', 'cat-1'),
    ).rejects.toThrow(NotFoundException);
  });
});
