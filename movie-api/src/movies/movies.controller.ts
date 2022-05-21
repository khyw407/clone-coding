import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {};

  @Get()
  getAll(){
    return this.movieService.getAll();
  }

  @Get('/:id')
  getOne(@Param("id") movieId : number){
    return this.movieService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDto){
    return this.movieService.create(movieData);
  }

  @Delete('/:id')
  remove(@Param("id") movieId: number){
    return this.movieService.deleteOne(movieId);
  }

  @Patch('/:id')
  patch(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto){
    return this.movieService.update(movieId, updateData);
  }
}
