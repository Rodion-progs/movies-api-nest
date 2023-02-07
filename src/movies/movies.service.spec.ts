import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

const mockMovie = {
  title: 'test',
  genres: ['test'],
  year: 2000,
};

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test function getAll ', () => {
    it('should return array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('test function getOne ', () => {
    it('should return movie', () => {
      const id = 1;
      service.create(mockMovie);
      const result = service.getOne(id);
      expect(result).toBeDefined();
      expect(result.id).toEqual(id);
    });

    it('should return 404 error', () => {
      const id = 9999;
      try {
        service.getOne(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('test function remove ', () => {
    it('film removed', () => {
      service.create(mockMovie);
      const allMovies = service.getAll();
      service.remove(1);
      const afterRemove = service.getAll();

      expect(afterRemove.length).toEqual(allMovies.length - 1);
    });

    it('should return 404 error', () => {
      const id = 9999;
      try {
        service.remove(id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('test function create ', () => {
    it('film created', () => {
      const allMoviesLength = service.getAll().length;
      service.create(mockMovie);
      const afterCreateLength = service.getAll().length;

      expect(afterCreateLength).toBeGreaterThan(allMoviesLength);
    });
  });

  describe('test function patch ', () => {
    it('film patched', () => {
      const changedTitle = 'changedTitle';
      service.create(mockMovie);
      service.patch(1, { title: changedTitle });
      const movie = service.getOne(1);

      expect(movie.title).toEqual(changedTitle);
    });

    it('film patched 404 error', () => {
      try {
        service.patch(1, { title: '' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
