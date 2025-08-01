import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase(); 
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } 
    catch (error)
    {
      this.handleExceptions(error, 'create');
    }
  }

  async findAll() {
    return await this.pokemonModel.find().exec();
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) 
      pokemon = await this.pokemonModel.findOne({no: term});

    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({name: term.toLowerCase().trim()});

    if(!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`); 

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    
    if (updatePokemonDto.name) 
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase(); 

    try 
    {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    }
    catch(error)
    {
      this.handleExceptions(error, 'update');
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({_id: id});
    
    if (deletedCount === 0) 
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return;

  }

  private handleExceptions(error: any, action: string) {
    if (error.code === 11000) 
      throw new BadRequestException(`Pokemon exits in db ${JSON.stringify(error.keyValue)}`);

    throw new InternalServerErrorException(`Can't ${action} Pokemon - Check server logs`);
  }
}
