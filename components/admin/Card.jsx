import React from 'react';
import RenderStars, { renderStars } from '../ui/stars';
import { BookmarkIcon } from 'lucide-react';

export default function Card(props) {

  return (
    <div className="max-w-lg w-full lg:max-w-full lg:flex shadow-lg">
      <div className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t 
        lg:rounded-t-none lg:rounded-l text-center overflow-hidden p-3"
        style={{ backgroundImage: `url("${props.image}")` }}></div>
      <div className="p-6 border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
        <h3 className='text-2xl font-bold border-b-zinc-600 border-b text-sky-900'>Produto</h3>
        { (
          //TODO se houver rating exibir estrelas vazias e traço no lugar do valor
          <div className="flex items-center mt-2 text-black">
            <RenderStars rating={props.rating}></RenderStars>
          </div>
        )}
        <div className="text-gray-900 font-bold text-xl mb-2">{props.name}</div>
        <p className="text-gray-700 text-base">{props.description}</p>
        <p className="text-gray-500 text-base flex mt-3"><BookmarkIcon />{props.categorie}</p>
      </div>
    </div>
  );
}


