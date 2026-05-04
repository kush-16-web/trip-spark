import React, { useState } from 'react';
import Sun from '../../assets/sun.gif';
import Cloudy from '../../assets/cloudy.gif';
import Fog from '../../assets/foggy.gif';
import Raining from '../../assets/raining.gif';
import Snowing from '../../assets/snowing.gif';
import Thunderstorm from '../../assets/thunderstorm.gif';
import chair from '../../assets/beach-chair.gif';
import crystalBall from '../../assets/crystal-ball.gif';

import {
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Activity {
  title: string;
  desc: string;
  time: string;
}

interface Weather {
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

interface ItineraryDayProps {
  dayNumber: number;
  activities: readonly Activity[];
  isEditMode: boolean;
  weather?: Weather;
  date?: string;
  onReorder: (oldIndex: number, newIndex: number) => void;
  onAddActivity: () => void;
  onDeleteActivity: (index: number) => void;
  onUpdateActivity: (index: number, updatedActivity: Activity) => void;
  onGenerateDayAI?: (prompt: string) => void; 
  isGeneratingAI?: boolean; 
}

interface ActivityItemProps {
  id: string;
  item: Activity;
  idx: number;
  isEditMode: boolean;
  editingIdx: number | null;
  setEditingIdx: (idx: number | null) => void;
  confirmDeleteIdx: number | null;
  setConfirmDeleteIdx: (idx: number | null) => void;
  onUpdateActivity: (index: number, updatedActivity: Activity) => void;
  onDeleteActivity: (index: number) => void;
}

function ActivityItem({
  id,
  item,
  idx,
  isEditMode,
  editingIdx,
  setEditingIdx,
  confirmDeleteIdx,
  setConfirmDeleteIdx,
  onUpdateActivity,
  onDeleteActivity
}: ActivityItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <details
        open={idx === 0}
        className="group/details border-b border-slate-100 last:border-0 pb-4 md:pb-6 last:pb-0"
      >
        <summary className="list-none cursor-pointer flex items-center gap-4 md:gap-6">
          {/* Drag Handle - ONLY this badge triggers the drag */}
          <div 
            {...listeners} 
            className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black text-sm md:text-lg flex items-center justify-center shrink-0 shadow-lg shadow-slate-200 transition-transform ${isEditMode ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''}`}
          >
            {idx + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 md:gap-3 mb-0.5 md:mb-1">
              {isEditMode && editingIdx === idx ? (
                <input
                  className="bg-transparent border-b border-violet-200 outline-none text-[10px] font-black text-violet-600 w-20"
                  value={item.time}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      setEditingIdx(null);
                    }
                  }}
                  onChange={(e) => onUpdateActivity(idx, { ...item, time: e.target.value })}
                />
              ) : (
                <span className="text-[8px] md:text-[10px] font-black text-violet-600 uppercase tracking-widest px-1.5 py-0.5 bg-violet-50 rounded">
                  {item.time}
                </span>
              )}
            </div>
            
            {isEditMode && editingIdx === idx ? (
              <input
                className="w-full bg-transparent border-b border-slate-200 outline-none font-black text-slate-800 md:text-lg tracking-tight mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    setEditingIdx(null);
                  }
                }}
                value={item.title}
                onChange={(e) => onUpdateActivity(idx, { ...item, title: e.target.value })}
              />
            ) : (
              <h5 className="text-base md:text-2xl font-black text-slate-900 tracking-tight group-hover/details:text-violet-600 transition-colors truncate">
                {item.title}
              </h5>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingIdx(editingIdx === idx ? null : idx);
                }}
                className={`font-black text-[10px] uppercase tracking-tighter px-3 py-1 rounded-lg transition-all duration-300 ${
                  editingIdx === idx 
                    ? "bg-emerald-600 text-white" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {editingIdx === idx ? "Save" : "Edit"}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirmDeleteIdx === idx) {
                    onDeleteActivity(idx);
                    setConfirmDeleteIdx(null);
                  } else {
                    setConfirmDeleteIdx(idx);
                    setTimeout(() => setConfirmDeleteIdx(null), 3000);
                  }
                }}
                className={`font-black text-[10px] uppercase tracking-tighter px-3 py-1 rounded-lg transition-all duration-300 ${
                  confirmDeleteIdx === idx
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-red-50 text-red-500 hover:bg-red-100"
                }`}
              >
                {confirmDeleteIdx === idx ? "Sure?" : "Del"}
              </button>
            </div>
          )}

          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 flex items-center justify-center group-open/details:bg-slate-50 transition-colors">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-open/details:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </summary>

        <div className="mt-3 md:mt-4 pl-14 md:pl-20 pr-2 md:pr-10">
          {isEditMode && editingIdx === idx ? (
            <textarea
              className="w-full bg-transparent border-b border-slate-200 outline-none font-medium text-slate-700 md:text-base leading-relaxed p-3 min-h-[100px]"
              value={item.desc}
              onKeyDown={(e) => {
                if(e.key === "Enter") {
                  e.preventDefault();
                  setEditingIdx(null);
                }
              }}
              onChange={(e) => onUpdateActivity(idx, { ...item, desc: e.target.value })}
            />
          ) : (
            <p className="text-slate-600 leading-relaxed text-sm md:text-lg font-medium bg-slate-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100/50">
              {item.desc}
            </p>
          )}
        </div>
      </details>
    </div>
  );
}

const ItineraryDay: React.FC<ItineraryDayProps> = ({
  dayNumber,
  activities,
  isEditMode,
  weather,
  date,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivity,
  onReorder,
  onGenerateDayAI,
  isGeneratingAI
}) => {
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const [showAIInput, setShowAIInput] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState("");

  return (
    <div className="relative group">
      {/* Card Decoration */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3.5rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>

      <div className="relative p-5 md:p-14 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-violet-50/50 rounded-bl-[5rem] md:rounded-bl-[10rem] -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 mb-8 md:mb-12 border-b border-slate-50 pb-8 md:pb-10">
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <h4 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Day {dayNumber}
              </h4>
              <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                AI Plan
              </div>
            </div>
            {date && (
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm md:text-lg">
                <span className="w-6 h-[2px] bg-slate-200" />
                {date}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4">
            <div className="bg-slate-50 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl border border-slate-100 flex flex-col items-center">
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stops</span>
              <span className="text-lg md:text-2xl font-black text-slate-900">{activities.length}</span>
            </div>

            {/* Weather Logic */}
            {weather && (
              <div className="flex items-center gap-3 md:gap-4 bg-white border border-violet-100 rounded-[1.5rem] md:rounded-[2rem] p-1.5 md:p-2 pr-4 md:pr-6 shadow-lg shadow-violet-100/50">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-white flex items-center justify-center shrink-0">
                  {weather.weatherCode === 0 ? <img src={Sun} alt="Sun" className='w-12 h-12' /> :
                    weather.weatherCode === 1 || weather.weatherCode === 2 ? <img src={Cloudy} alt="Cloudy" className='w-12 h-12' /> :
                      weather.weatherCode === 3 ? <img src={Cloudy} alt="Cloudy" className='w-12 h-12' /> :
                        weather.weatherCode === 45 || weather.weatherCode === 48 ? <img src={Fog} alt="Fog" className='w-12 h-12' /> :
                          weather.weatherCode === 51 || weather.weatherCode === 53 || weather.weatherCode === 55 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> :
                            weather.weatherCode === 56 || weather.weatherCode === 57 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> :
                              weather.weatherCode === 61 || weather.weatherCode === 63 || weather.weatherCode === 65 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> :
                                weather.weatherCode === 66 || weather.weatherCode === 67 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> :
                                  weather.weatherCode === 71 || weather.weatherCode === 73 || weather.weatherCode === 75 ? <img src={Snowing} alt="Snowing" className='w-12 h-12' /> :
                                    weather.weatherCode === 77 ? <img src={Snowing} alt="Snowing" className='w-12 h-12' /> :
                                      weather.weatherCode === 80 || weather.weatherCode === 81 || weather.weatherCode === 82 ? <img src={Raining} alt="Raining" className='w-12 h-12' /> :
                                        weather.weatherCode === 85 || weather.weatherCode === 86 ? <img src={Snowing} alt="Snowing" className='w-12 h-12' /> :
                                          weather.weatherCode === 95 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-12 h-12' /> :
                                            weather.weatherCode === 96 || weather.weatherCode === 99 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-12 h-12' /> : ''}
                </div>
                <div className="flex flex-col">
                  <span className="text-base md:text-xl font-black text-slate-900 leading-none mb-0.5">
                    {weather.tempMax}° / {weather.tempMin}°
                  </span>
                  <span className="text-[8px] md:text-[10px] font-bold text-violet-500 uppercase tracking-wider italic">
                    {weather.weatherCode === 0 ? "Perfect Sun" :
                      weather.weatherCode >= 1 && weather.weatherCode <= 3 ? "Mild & Nice" :
                        weather.weatherCode >= 51 && weather.weatherCode <= 67 ? "Rainy Outlook" :
                          weather.weatherCode >= 80 && weather.weatherCode <= 82 ? "Showers Expected" :
                            weather.weatherCode >= 95 ? "Storm Risk" : "Variable Sky"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {(!activities || activities.length === 0) ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 text-center shadow-sm relative overflow-hidden">
              {isGeneratingAI ? (
                <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 py-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-50/50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <img src={crystalBall} alt="Generating..." className="w-16 h-16 md:w-20 md:h-20 object-contain animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">Consulting the Oracle...</h4>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto">
                    Crafting the perfect day based on your vibe. Hang tight!
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <img src={chair} alt="Chair" className='w-16 h-16 rounded-full' />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-2">You have a free day!</h4>
                  <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">This day is completely empty. How would you like to plan it?</p>
                  
                  {isEditMode ? (
                    showAIInput ? (
                  <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {/* A sleek lightning bolt icon instead of sparkles */}
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <input 
                        type="text" 
                        maxLength={100}
                        placeholder="E.g., A relaxing morning with local coffee..."
                        className="w-full pl-12 pr-[120px] py-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-900 rounded-2xl outline-none font-medium text-slate-700 transition-all shadow-sm focus:shadow-md"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isGeneratingAI && aiPrompt.trim()) {
                            onGenerateDayAI?.(aiPrompt);
                            setShowAIInput(false);
                          }
                        }}
                        autoFocus
                      />
                      <div className="absolute inset-y-2 right-2 flex items-center gap-1">
                        <button 
                          onClick={() => setShowAIInput(false)}
                          className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (!aiPrompt.trim()) return;
                            onGenerateDayAI?.(aiPrompt);
                            setShowAIInput(false);
                          }} 
                          disabled={isGeneratingAI || !aiPrompt.trim()}
                          className="w-10 h-10 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md shadow-slate-900/20"
                        >
                          {isGeneratingAI ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] md:text-xs text-slate-400 font-medium mt-3 text-center">
                      Press <kbd className="font-sans px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-slate-500">Enter</kbd> to generate
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row gap-4 justify-center animate-in fade-in duration-300">
                    <button 
                      onClick={onAddActivity}
                      className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-full hover:border-slate-400 hover:text-slate-900 transition-all"
                    >
                      Add manually
                    </button>
                    <button 
                      onClick={() => setShowAIInput(true)}
                      className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Auto-fill schedule
                    </button>
                  </div>
                )
              ) : (
                <div className="text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full inline-block">No plans yet. Enter Edit Mode to add some!</div>
              )}
              </div>
            )}
            </div>
          ) : (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                  const { active, over } = event;
                  if (active && over && active.id !== over.id) {
                    const oldIndex = activities.findIndex((_, i) => `activity-${i}` === active.id);
                    const newIndex = activities.findIndex((_, i) => `activity-${i}` === over.id);
                    onReorder(oldIndex, newIndex);
                  }
                }}
              >
                <SortableContext
                  items={activities.map((_, i) => `activity-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-6">
                    {activities.map((item, idx) => (
                      <ActivityItem
                        key={`activity-item-${idx}`} 
                        id={`activity-${idx}`}
                        item={item}
                        idx={idx}
                        isEditMode={isEditMode}
                        editingIdx={editingIdx}
                        setEditingIdx={setEditingIdx}
                        confirmDeleteIdx={confirmDeleteIdx}
                        setConfirmDeleteIdx={setConfirmDeleteIdx}
                        onUpdateActivity={onUpdateActivity}
                        onDeleteActivity={onDeleteActivity}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {isEditMode && (
                <div className="space-y-4 mt-8">
                  <button onClick={onAddActivity} className="w-full py-4 md:py-6 border-2 border-dashed border-slate-200 rounded-2xl md:rounded-[2rem] text-slate-400 font-bold hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50/50 transition-all flex items-center justify-center gap-2 group text-sm md:text-base">
                    <span className="text-lg md:text-xl group-hover:rotate-90 transition-transform">+</span>
                    Add Activity Manually
                  </button>

                  {showAIInput ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <input 
                          type="text" 
                          placeholder="What should we add? E.g., A jazz bar for the evening..."
                          className="w-full pl-12 pr-[100px] py-4 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-2xl outline-none font-medium text-slate-700 transition-all shadow-sm focus:shadow-md"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && aiPrompt.trim()) {
                              onGenerateDayAI?.(aiPrompt);
                              setShowAIInput(false);
                            }
                          }}
                          autoFocus
                        />
                        <button 
                          onClick={() => {
                            if (aiPrompt.trim()) {
                              onGenerateDayAI?.(aiPrompt);
                              setShowAIInput(false);
                            }
                          }}
                          className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                        >
                          Fill
                        </button>
                      </div>
                      <button onClick={() => setShowAIInput(false)} className="mt-2 text-[10px] text-slate-400 font-bold uppercase hover:text-slate-600 transition-colors">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setShowAIInput(true)}
                      className="w-full px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-4 h-4 opacity-70 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Auto-fill with AI
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDay;
