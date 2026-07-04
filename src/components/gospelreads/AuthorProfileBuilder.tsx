/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  BookOpen, 
  PenTool, 
  Check, 
  Eye, 
  Settings
} from 'lucide-react';
import { AuthorProfile, Book } from './types';

const Twitter = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


interface AuthorProfileBuilderProps {
  profile: AuthorProfile;
  setProfile: (profile: AuthorProfile | ((prev: AuthorProfile) => AuthorProfile)) => void;
  books: Book[];
}

export default function AuthorProfileBuilder({ profile, setProfile, books }: AuthorProfileBuilderProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFeaturedBook = (bookId: string) => {
    setProfile(prev => {
      const isFeatured = prev.featuredBookIds.includes(bookId);
      const updatedIds = isFeatured
        ? prev.featuredBookIds.filter(id => id !== bookId)
        : [...prev.featuredBookIds, bookId];
      return { ...prev, featuredBookIds: updatedIds };
    });
  };

  const triggerSave = () => {
    setIsSavedAlert(true);
    setTimeout(() => { setIsSavedAlert(false); }, 2000);
  };

  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  ];

  const featuredBooks = books.filter(b => profile.featuredBookIds.includes(b.id));

  return (
    <div className="w-full bg-white dark:bg-zinc-950 min-h-[calc(100vh-4rem)] p-6 md:p-12 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header and Toggle view */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-sm font-bold text-indigo-500 dark:text-indigo-400 tracking-[0.2em] uppercase font-mono bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50 w-fit block mb-3">PORTFÓLIO DE AUTOR</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 uppercase tracking-tight lg:text-4xl">Editor de Perfil</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Crie uma vitrine digital majestosa para se conectar com seus leitores.</p>
          </div>

          <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 border border-gray-200 dark:border-zinc-800 rounded-lg">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 text-sm uppercase tracking-widest font-bold flex items-center gap-2 transition-all rounded-lg cursor-pointer ${
                activeTab === 'editor' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'
              }`}
            >
              <Settings size={14} /> Customizar
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm uppercase tracking-widest font-bold flex items-center gap-2 transition-all rounded-lg cursor-pointer ${
                activeTab === 'preview' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100'
              }`}
            >
              <Eye size={14} /> Ver Página Pública
            </button>
          </div>
        </div>

        {/* Saved Toast Alert */}
        {isSavedAlert && (
          <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 justify-center">
            <Check size={14} className="text-indigo-500 dark:text-indigo-400" /> Alterações salvas com êxito! Seu portfólio público foi atualizado.
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'editor' ? (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Form Column */}
            <div className="lg:col-span-7 bg-gray-100 dark:bg-zinc-900 p-6 md:p-8 border border-gray-200 dark:border-zinc-800 space-y-6 rounded-lg">
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-3 font-mono">
                <PenTool size={14} /> Detalhes Biográficos
              </h3>

              {/* Names */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block">Nome Civil</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block">Pseudônimo Literário</label>
                  <input
                    type="text"
                    name="penName"
                    value={profile.penName}
                    onChange={handleInputChange}
                    placeholder="Nome artístico (ex: L. C. Star)"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block">Biografia do Autor</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Escreva sobre suas inspirações, prêmios, histórico literário..."
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block">Avatar do Perfil</label>
                <div className="flex items-center gap-4">
                  <img
                    src={profile.avatarUrl}
                    alt="Current profile avatar"
                    className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-zinc-700"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-zinc-400">Escolha um dos retratos autorais padrão ou envie uma imagem externa:</p>
                    <div className="flex gap-2">
                      {avatarPresets.map((url, idx) => (
                        <button
                          key={idx}
                          onClick={() => setProfile(prev => ({ ...prev, avatarUrl: url }))}
                          className={`w-10 h-10 rounded-full overflow-hidden border cursor-pointer ${
                            profile.avatarUrl === url ? 'border-indigo-500 ring-2 ring-indigo-300 dark:ring-indigo-700' : 'border-gray-200 dark:border-zinc-700'
                          }`}
                        >
                          <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  name="avatarUrl"
                  value={profile.avatarUrl}
                  onChange={handleInputChange}
                  placeholder="URL de foto customizada..."
                  className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 focus:outline-none mt-2"
                />
              </div>

              {/* Social networks */}
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pt-4 pb-3 font-mono">
                <Globe size={14} /> Redes Sociais & Contato
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block flex items-center gap-1">
                    <Globe size={11} className="text-indigo-500 dark:text-indigo-400" /> Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={profile.website}
                    onChange={handleInputChange}
                    placeholder="https://meusite.com"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block flex items-center gap-1">
                    <Twitter size={11} className="text-indigo-500 dark:text-indigo-400" /> Twitter / X
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    value={profile.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/autor"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 block flex items-center gap-1">
                    <Instagram size={11} className="text-indigo-500 dark:text-indigo-400" /> Instagram
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={profile.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/autor"
                    className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Book linking */}
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pt-4 pb-3 font-mono">
                <BookOpen size={14} /> Vincular Livros Publicados
              </h3>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-3">Selecione quais obras do catálogo oficial da GospelReads. pertencem ao seu portfólio destacado:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {books.map(b => {
                    const isSelected = profile.featuredBookIds.includes(b.id);
                    return (
                      <div
                        key={b.id}
                        onClick={() => toggleFeaturedBook(b.id)}
                        className={`p-3.5 border cursor-pointer flex items-center gap-3 transition-all rounded-lg ${
                          isSelected 
                            ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/30' 
                            : 'border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <img src={b.coverUrl} alt={b.title} className="w-8 h-12 object-cover border border-gray-200 dark:border-zinc-700 rounded-lg shrink-0" />
                        <div className="overflow-hidden">
                          <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{b.title}</div>
                          <div className="text-sm text-gray-400 dark:text-zinc-500 truncate">{b.author}</div>
                        </div>
                        <div className={`w-4 h-4 ml-auto rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-300 dark:border-zinc-600'
                        }`}>
                          {isSelected && <Check size={10} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={triggerSave}
                  className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white text-sm font-bold uppercase tracking-widest py-3 px-8 transition-colors rounded-lg cursor-pointer"
                >
                  Salvar Portfólio
                </button>
              </div>

            </div>

            {/* Quick Live Preview column */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <div className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 rounded-lg text-center mb-4 text-gray-400 dark:text-zinc-500">
                <span className="text-sm font-mono uppercase tracking-widest">
                  Demonstração da Página de Autor ao Vivo
                </span>
              </div>

              {/* Minimalist Premium Paper Render */}
              <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg p-8 space-y-8 min-h-[500px]">
                <div className="text-center space-y-3">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.penName}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-indigo-100 dark:border-indigo-900/50"
                  />
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-zinc-100 leading-tight">
                      {profile.penName || profile.name || 'Pseudônimo do Autor'}
                    </h4>
                    <p className="text-sm text-indigo-500 dark:text-indigo-400 font-mono uppercase tracking-widest mt-1">Escritor Independente</p>
                  </div>
                </div>

                <div className="font-serif text-sm text-gray-600 dark:text-zinc-300 text-justify border-t border-b border-gray-200 dark:border-zinc-700 py-6 leading-relaxed">
                  {profile.bio || 'Adicione uma bela biografia para que os seus leitores possam conhecer mais a fundo suas inspirações e sua voz artística.'}
                </div>

                {/* Social media footer inside page */}
                <div className="flex justify-center gap-4 text-gray-400 dark:text-zinc-500">
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      <Globe size={16} />
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      <Twitter size={16} />
                    </a>
                  )}
                  {profile.instagram && (
                    <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      <Instagram size={16} />
                    </a>
                  )}
                </div>

                {/* Featured books listed inside */}
                {featuredBooks.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                    <h5 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 text-center font-mono">Livros em Destaque</h5>
                    <div className="grid grid-cols-3 gap-3">
                      {featuredBooks.map(b => (
                        <div key={b.id} className="text-center group">
                          <div className="aspect-[2/3] bg-gray-200 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden mb-1.5 shadow-sm">
                            <img src={b.coverUrl} alt={b.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-zinc-100 truncate">{b.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          /* Large Standalone Full Public Profile Mockup */
          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg p-8 md:p-16 max-w-4xl mx-auto space-y-12">
            
            {/* Header section with cover elements */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 pb-8 border-b border-gray-200 dark:border-zinc-700">
              <img
                src={profile.avatarUrl}
                alt={profile.penName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900/50 shadow-lg"
              />
              <div className="text-center md:text-left space-y-4 flex-1">
                <div className="space-y-1">
                  <span className="text-sm font-bold tracking-[0.2em] text-indigo-500 dark:text-indigo-400 font-mono uppercase bg-indigo-50 dark:bg-indigo-950/30 px-3.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50 w-fit mx-auto md:mx-0 block">CATÁLOGO EDITORIAL DE AUTOR</span>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-100 leading-tight pt-2 uppercase tracking-tight">
                    {profile.penName || profile.name || 'Pseudônimo'}
                  </h1>
                </div>
                
                {/* Social media icons with labels */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {profile.website && (
                    <a href="#" className="text-sm font-mono text-gray-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1.5 border border-gray-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                      <Globe size={12} className="text-indigo-500 dark:text-indigo-400" /> {new URL(profile.website).hostname}
                    </a>
                  )}
                  {profile.twitter && (
                    <a href="#" className="text-sm font-mono text-gray-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1.5 border border-gray-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                      <Twitter size={12} className="text-indigo-500 dark:text-indigo-400" /> Twitter / X
                    </a>
                  )}
                  {profile.instagram && (
                    <a href="#" className="text-sm font-mono text-gray-500 dark:text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1.5 border border-gray-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                      <Instagram size={12} className="text-indigo-500 dark:text-indigo-400" /> Instagram
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Layout Content */}
            <div className="grid md:grid-cols-12 gap-12">
              
              {/* Biography Block */}
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-2 font-mono">
                  <BookOpen size={14} className="text-indigo-500 dark:text-indigo-400" /> Memorial Literário
                </h3>
                <div className="font-serif text-lg leading-relaxed text-justify text-gray-600 dark:text-zinc-300 space-y-4">
                  {profile.bio ? profile.bio.split('\n\n').map((p, idx) => (
                    <p key={idx} className="indent-8">{p}</p>
                  )) : (
                    <p className="indent-8 text-gray-400 dark:text-zinc-500">Nenhuma biografia adicionada.</p>
                  )}
                </div>
              </div>

              {/* Sidebar with catalog cards */}
              <div className="md:col-span-5 space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 flex items-center gap-2 font-mono">
                  <BookOpen size={14} /> Obras Publicadas ({featuredBooks.length})
                </h3>

                <div className="space-y-4">
                  {featuredBooks.length > 0 ? (
                    featuredBooks.map(b => (
                      <div key={b.id} className="border border-gray-200 dark:border-zinc-700 p-4 rounded-lg flex gap-4 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                        <img src={b.coverUrl} alt={b.title} className="w-14 h-20 object-cover border border-gray-200 dark:border-zinc-700 rounded-lg shadow-sm shrink-0" />
                        <div className="space-y-1.5 overflow-hidden">
                          <h4 className="text-base font-bold text-gray-900 dark:text-zinc-100 truncate leading-none">{b.title}</h4>
                          <p className="text-sm text-indigo-500 dark:text-indigo-400 font-mono tracking-wider uppercase">{b.genre}</p>
                          <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 mt-1">{b.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 border border-dashed border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-zinc-500 text-sm rounded-lg">
                      Nenhuma obra vinculada ainda. Vincule seus livros publicados na aba de edição para exibi-los aqui!
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
