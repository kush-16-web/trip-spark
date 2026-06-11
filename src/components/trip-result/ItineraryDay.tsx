import React, { useState } from 'react';
import { GhostWriter } from '../GhostWriter';
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
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
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
  tripType?: string;
  needsSync: boolean;
  onSync: () => void;
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
        <summary className="list-none cursor-pointer flex items-start md:items-center gap-4 md:gap-6">
          {/* Drag Handle - ONLY this badge triggers the drag */}
          <div
            {...listeners}
            style={{ touchAction: isEditMode ? 'none' : 'auto' }}
            className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-900 text-white font-black text-sm md:text-lg flex items-center justify-center shrink-0 shadow-lg shadow-slate-200 transition-transform ${isEditMode ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''}`}
          >
            {idx + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title Section */}
            <div className="mb-1 md:mb-0">
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
                  autoFocus
                />
              ) : (
                <h5 className="text-base md:text-2xl font-black text-slate-900 tracking-tight group-hover/details:text-violet-600 transition-colors truncate">
                  {item.title}
                </h5>
              )}
            </div>

            {/* Meta & Mobile Actions Row */}
            <div className="flex items-center gap-2 md:gap-3">
              {isEditMode && editingIdx === idx ? (
                <input
                  className="bg-transparent border-b border-violet-200 outline-none text-[10px] font-black text-violet-600 w-20"
                  value={item.time}
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

              {/* Mobile Only Action Tray */}
              {isEditMode && (
                <div className="flex md:hidden items-center gap-1.5 ml-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingIdx(editingIdx === idx ? null : idx);
                    }}
                    className={`p-2 rounded-lg transition-all duration-300 ${editingIdx === idx
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                  >
                    {editingIdx === idx ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    )}
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
                    className={`p-2 rounded-lg transition-all duration-300 ${confirmDeleteIdx === idx
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-red-50 text-red-500 hover:bg-red-100"
                      }`}
                  >
                    {confirmDeleteIdx === idx ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Only Action Tray */}
          {isEditMode && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingIdx(editingIdx === idx ? null : idx);
                }}
                className={`p-2.5 rounded-xl transition-all duration-300 ${editingIdx === idx
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                title={editingIdx === idx ? "Save" : "Edit"}
              >
                {editingIdx === idx ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                )}
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
                className={`p-2.5 rounded-xl transition-all duration-300 ${confirmDeleteIdx === idx
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-red-50 text-red-500 hover:bg-red-100"
                  }`}
                title={confirmDeleteIdx === idx ? "Confirm Delete" : "Delete"}
              >
                {confirmDeleteIdx === idx ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </div>
          )}

          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-100 flex items-center justify-center group-open/details:bg-slate-50 transition-colors shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-open/details:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </summary>


        <div className="mt-4 md:mt-4 pl-0 md:pl-20 pr-0 md:pr-10">
          {isEditMode && editingIdx === idx ? (
            <textarea
              className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl outline-none font-medium text-slate-700 text-sm md:text-base leading-relaxed p-4 min-h-[120px] focus:bg-white focus:border-violet-400 transition-all"
              value={item.desc}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setEditingIdx(null);
                }
              }}
              onChange={(e) => onUpdateActivity(idx, { ...item, desc: e.target.value })}
            />
          ) : (
            <div className="text-slate-600 leading-relaxed text-[13px] md:text-lg font-medium bg-slate-50/40 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100/30">
              <GhostWriter text={item.desc} />
            </div>
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
  isGeneratingAI,
  tripType,
  needsSync,
  onSync
}) => {
  const [confirmDeleteIdx, setConfirmDeleteIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [showAIInput, setShowAIInput] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState("");

  return (
    <div className="relative group">
      {/* Card Decoration */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3.5rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>

      <div className="relative  p-5 md:p-8 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 transition-all overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-violet-50/50 rounded-bl-[5rem] md:rounded-bl-[10rem] -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10 border-b border-slate-50 pb-8">
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-black text-slate-900 tracking-tighter">
                Day {dayNumber}
              </h4>
              <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                AI Plan
              </div>
            </div>
            {date && (
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs md:text-sm">
                <span className="w-4 h-[2px] bg-slate-200" />
                {date}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3">
            <div className="bg-slate-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-slate-100 flex flex-col items-center">
              <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Stops</span>
              <span className="text-base md:text-xl font-black text-slate-900">{activities.length}</span>
            </div>

            {/* Weather Logic */}
            {weather && (
              <div className="flex items-center gap-2 md:gap-3 bg-white border border-violet-100 rounded-[1.2rem] md:rounded-[1.5rem] p-1 md:p-1.5 pr-3 md:pr-4 shadow-lg shadow-violet-100/50">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white flex items-center justify-center shrink-0">
                  {weather.weatherCode === 0 ? <img src={Sun} alt="Sun" className='w-8 h-8 md:w-10 md:h-10' /> :
                    weather.weatherCode === 1 || weather.weatherCode === 2 ? <img src={Cloudy} alt="Cloudy" className='w-8 h-8 md:w-10 md:h-10' /> :
                      weather.weatherCode === 3 ? <img src={Cloudy} alt="Cloudy" className='w-8 h-8 md:w-10 md:h-10' /> :
                        weather.weatherCode === 45 || weather.weatherCode === 48 ? <img src={Fog} alt="Fog" className='w-8 h-8 md:w-10 md:h-10' /> :
                          weather.weatherCode === 51 || weather.weatherCode === 53 || weather.weatherCode === 55 ? <img src={Raining} alt="Raining" className='w-8 h-8 md:w-10 md:h-10' /> :
                            weather.weatherCode === 56 || weather.weatherCode === 57 ? <img src={Raining} alt="Raining" className='w-8 h-8 md:w-10 md:h-10' /> :
                              weather.weatherCode === 61 || weather.weatherCode === 63 || weather.weatherCode === 65 ? <img src={Raining} alt="Raining" className='w-8 h-8 md:w-10 md:h-10' /> :
                                weather.weatherCode === 66 || weather.weatherCode === 67 ? <img src={Raining} alt="Raining" className='w-8 h-8 md:w-10 md:h-10' /> :
                                  weather.weatherCode === 71 || weather.weatherCode === 73 || weather.weatherCode === 75 ? <img src={Snowing} alt="Snowing" className='w-8 h-8 md:w-10 md:h-10' /> :
                                    weather.weatherCode === 77 ? <img src={Snowing} alt="Snowing" className='w-8 h-8 md:w-10 md:h-10' /> :
                                      weather.weatherCode === 80 || weather.weatherCode === 81 || weather.weatherCode === 82 ? <img src={Raining} alt="Raining" className='w-8 h-8 md:w-10 md:h-10' /> :
                                        weather.weatherCode === 85 || weather.weatherCode === 86 ? <img src={Snowing} alt="Snowing" className='w-8 h-8 md:w-10 md:h-10' /> :
                                          weather.weatherCode === 95 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-8 h-8 md:w-10 md:h-10' /> :
                                            weather.weatherCode === 96 || weather.weatherCode === 99 ? <img src={Thunderstorm} alt="Thunderstorm" className='w-8 h-8 md:w-10 md:h-10' /> : ''
                  }
                </div>
                <div className="flex flex-col">
                  <span className="text-sm md:text-lg font-black text-slate-900 leading-none">
                    {weather.tempMax}° / {weather.tempMin}°
                  </span>
                  <span className="text-[7px] md:text-[9px] font-bold text-violet-500 uppercase tracking-wider">
                    {weather.weatherCode === 0 ? "Hotter than your last selfie." :
                      weather.weatherCode >= 1 && weather.weatherCode <= 3 ? (
                        tripType?.toLowerCase() === 'couple' ? "Perfect lighting for a date." :
                          tripType?.toLowerCase() === 'family' ? "Perfect lighting for a family picnic" :
                            tripType?.toLowerCase() === 'solo' ? "Perfect lighting for a solo adventure" : "Mild & Nice vibes"
                      ) :
                        weather.weatherCode === 45 || weather.weatherCode === 48 ? "Wear sunglasses and a jacket" :
                          (weather.weatherCode >= 51 && weather.weatherCode <= 67) ? (tripType?.toLowerCase() === 'couple' ? "Perfect excuse to stay in and cuddle." : "Free hair wash day!") :
                            (weather.weatherCode >= 71 && weather.weatherCode <= 77 || weather.weatherCode === 85 || weather.weatherCode === 86) ? (tripType?.toLowerCase() === 'couple' ? "A winter wonderland is waiting for us." : "Prepare to look like a stylish penguin") :
                              (weather.weatherCode >= 80 && weather.weatherCode <= 82) ? (tripType?.toLowerCase() === 'couple' ? "We'll need a shared umbrella that day." : "Main character rain vibes") :
                                weather.weatherCode >= 95 ? "Zeus is having a tantrum!!" : "Variable Sky"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {needsSync && (
          <div className="mb-8 p-5 bg-amber-50/50 border border-amber-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-xl shadow-inner">✨</div>
              <div>
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-0.5">Context Mismatch</p>
                <p className="text-xs font-bold text-amber-600 leading-tight">This day was planned for your previous trip type. Want to refresh it?</p>
              </div>
            </div>
            <button 
              onClick={onSync}
              className="w-full md:w-auto px-6 py-3 bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 active:scale-95"
            >
              Update for {tripType}
            </button>
          </div>
        )}

        <div className="space-y-6">
          {(!activities || activities.length === 0) ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 text-center shadow-sm relative overflow-hidden">
              {isGeneratingAI ? (
                <div className="space-y-6 w-full max-w-2xl mx-auto">
                   {Array.from({ length: 3 }).map((_, i) => (
                     <div key={`itinerary-skeleton-${i}`} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm animate-pulse flex items-center gap-6">
                       <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                       <div className="flex-1 space-y-3">
                         <div className="w-1/3 h-5 bg-slate-100 rounded-lg" />
                         <div className="w-full h-3 bg-slate-50 rounded-lg" />
                       </div>
                     </div>
                   ))}
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
                        <div className="flex flex-col gap-2">
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              maxLength={100}
                              placeholder="E.g., A relaxing morning with local coffee..."
                              className="w-full pl-12 pr-4 md:pr-[120px] py-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-900 rounded-2xl outline-none font-medium text-slate-700 transition-all shadow-sm focus:shadow-md text-sm md:text-base"
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
                            {/* Desktop Only Buttons */}
                            <div className="hidden md:flex absolute inset-y-2 right-2 items-center gap-1">
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
                                className="w-10 h-10 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center shadow-md shadow-slate-900/20"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Mobile Only Buttons */}
                          <div className="flex md:hidden items-center justify-end gap-2 mt-1">
                            <button
                              onClick={() => setShowAIInput(false)}
                              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
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
                              className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20"
                            >
                              Generate
                            </button>
                          </div>
                        </div>
                        <p className="hidden md:block text-[10px] md:text-xs text-slate-400 font-medium mt-3 text-center">
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
                    {isGeneratingAI ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={`sync-skeleton-${i}`} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm animate-pulse flex items-center gap-6">
                          <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
                          <div className="flex-1 space-y-3">
                            <div className="w-1/3 h-5 bg-slate-100 rounded-lg" />
                            <div className="w-full h-3 bg-slate-50 rounded-lg" />
                          </div>
                        </div>
                      ))
                    ) : (
                      activities.map((item, idx) => (
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
                      ))
                    )}
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
                      <div className="flex flex-col gap-2">
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            placeholder="What should we add? E.g., A jazz bar..."
                            className="w-full pl-12 pr-4 md:pr-[80px] py-4 bg-slate-50 border border-slate-200 focus:border-slate-900 rounded-2xl outline-none font-medium text-slate-700 transition-all shadow-sm focus:shadow-md text-sm md:text-base"
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
                            className="hidden md:block absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                          >
                            Fill
                          </button>
                        </div>
                        <div className="flex md:hidden items-center justify-end gap-2">
                          <button onClick={() => setShowAIInput(false)} className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (aiPrompt.trim()) {
                                onGenerateDayAI?.(aiPrompt);
                                setShowAIInput(false);
                              }
                            }}
                            className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                          >
                            Add
                          </button>
                        </div>
                      </div>
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
