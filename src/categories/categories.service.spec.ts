import { ConflictException, NotFoundException } from '@nestjs/common';
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
    countTransactions: jest.fn(),
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

  it('should throw NotFoundException in ensureBelongsToUser for foreign category', async () => {
    repository.findByIdAndUser.mockResolvedValue(null);

    await expect(
      categoriesService.ensureBelongsToUser('cat-foreign', 'user-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update category after validating ownership', async () => {
    const existing = {
      id: 'cat-1',
      userId: 'user-1',
      name: 'Office',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = { ...existing, name: 'Office Supplies' };

    repository.findByIdAndUser.mockResolvedValue(existing);
    repository.update.mockResolvedValue(updated);

    const result = await categoriesService.update('user-1', 'cat-1', {
      name: 'Office Supplies',
    });

    expect(result.name).toBe('Office Supplies');
    expect(repository.update).toHaveBeenCalledWith('cat-1', 'user-1', {
      name: 'Office Supplies',
    });
  });

  it('should delete category after validating ownership', async () => {
    repository.findByIdAndUser.mockResolvedValue({
      id: 'cat-1',
      userId: 'user-1',
      name: 'Office',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repository.countTransactions.mockResolvedValue(0);
    repository.delete.mockResolvedValue(undefined);

    await categoriesService.remove('user-1', 'cat-1');

    expect(repository.delete).toHaveBeenCalledWith('cat-1', 'user-1');
  });

  it('should throw ConflictException when category has linked transactions', async () => {
    repository.findByIdAndUser.mockResolvedValue({
      id: 'cat-1',
      userId: 'user-1',
      name: 'Office',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repository.countTransactions.mockResolvedValue(3);

    await expect(categoriesService.remove('user-1', 'cat-1')).rejects.toThrow(
      ConflictException,
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
