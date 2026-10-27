import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  Video,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Sparkles,
  MapPinOff,
  ArrowRight
} from 'lucide-react';
import { Doctor, City } from '../types/index.ts';
import { useChat } from '../context/ChatContext.tsx';

interface DoctorDiscoveryProps {
  selectedCity: City;
  searchQuery: string;
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  onBookDoctor: (doctor: Doctor, type: 'in-clinic' | 'video') => void;
  onSwitchToBangalore?: () => void;
}

const SPECIALTIES = [
  'All Specialties',
  'General Physician',
  'Dermatologist',
  'Gynecologist',
  'Orthopedist',
  'Pediatrician',
  'Cardiologist',
];

const DEFAULT_BANGALORE_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Arjun Mehta',
    degree: 'MBBS, MD - Dermatology, Venereology & Leprosy',
    specialty: 'Dermatologist',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 540,
    location: 'Koramangala 4th Block, Bangalore',
    city: 'Bangalore',
    hospital: 'Skin & Laser Wellness Center',
    consultationFee: 900,
    availableToday: true,
    nextAvailableSlot: 'Today, 04:30 PM',
    languages: ['English', 'Hindi', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    tags: ['Acne Treatment', 'Hair Fall', 'Cosmetic Dermatology'],
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Sen',
    degree: 'MBBS, MS - Obstetrics & Gynaecology',
    specialty: 'Gynecologist',
    experienceYears: 16,
    rating: 4.9,
    reviewCount: 680,
    location: '100ft Road, Indiranagar, Bangalore',
    city: 'Bangalore',
    hospital: 'Fortis La Femme',
    consultationFee: 1000,
    availableToday: true,
    nextAvailableSlot: 'Today, 05:15 PM',
    languages: ['English', 'Hindi', 'Bengali', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1594824813515-888914c62c95?auto=format&fit=crop&w=300&q=80',
    tags: ['Pregnancy Care', 'PCOS/PCOD', 'Women Health'],
  },
  {
    id: 'doc-3',
    name: 'Dr. Priya Sharma',
    degree: 'MBBS, MD - General Medicine',
    specialty: 'General Physician',
    experienceYears: 14,
    rating: 4.85,
    reviewCount: 420,
    location: 'HSR Layout Sector 2, Bangalore',
    city: 'Bangalore',
    hospital: 'Apollo Clinic',
    consultationFee: 700,
    availableToday: true,
    nextAvailableSlot: 'Today, 06:00 PM',
    languages: ['English', 'Hindi', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    tags: ['Fever & Infections', 'Diabetes Care', 'Hypertension'],
  },
  {
    id: 'doc-4',
    name: 'Dr. Rajesh Nair',
    degree: 'MBBS, MS - Orthopaedics, Fellowship in Joint Replacement',
    specialty: 'Orthopedist',
    experienceYears: 19,
    rating: 4.8,
    reviewCount: 310,
    location: 'ITPL Main Road, Whitefield, Bangalore',
    city: 'Bangalore',
    hospital: 'Manipal Hospital Whitefield',
    consultationFee: 1100,
    availableToday: false,
    nextAvailableSlot: 'Tomorrow, 10:30 AM',
    languages: ['English', 'Hindi', 'Malayalam', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    tags: ['Knee Pain', 'Joint Replacement', 'Sports Injury'],
  },
  {
    id: 'doc-5',
    name: 'Dr. Sarah Verghese',
    degree: 'MBBS, MD - Pediatrics',
    specialty: 'Pediatrician',
    experienceYears: 13,
    rating: 4.95,
    reviewCount: 460,
    location: '4th Block, Jayanagar, Bangalore',
    city: 'Bangalore',
    hospital: 'Rainbow Children’s Hospital',
    consultationFee: 800,
    availableToday: true,
    nextAvailableSlot: 'Today, 03:45 PM',
    languages: ['English', 'Hindi', 'Kannada'],
    avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80',
    tags: ['Child Vaccination', 'Newborn Care', 'Growth Assessment'],
  },
  {
    id: 'doc-6',
    name: 'Dr. Vikramaditya Kulkarni',
    degree: 'MBBS, DM - Cardiology',
    specialty: 'Cardiologist',
    experienceYears: 22,
    rating: 4.92,
    reviewCount: 510,
    location: 'Margosa Road, Malleshwaram, Bangalore',
    city: 'Bangalore',
    hospital: 'Aster CMI Hospital',
    consultationFee: 1400,
    availableToday: false,
    nextAvailableSlot: 'Tomorrow, 11:30 AM',
    languages: ['English', 'Hindi', 'Kannada', 'Marathi'],
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
    tags: ['Heart Disease', 'ECG / Echo', 'Preventive Cardiology'],
  },
];

export const DoctorDiscoverySection: React.FC<DoctorDiscoveryProps> = ({
  selectedCity,
  searchQuery,
  selectedSpecialty,
  onSelectSpecialty,
  onBookDoctor,
  onSwitchToBangalore,
}) => {
  const { openChat } = useChat();
  const [doctors, setDoctors] = useState<Doctor[]>(DEFAULT_BANGALORE_DOCTORS);
  const [loading, setLoading] = useState(false);
  const [availableTodayOnly, setAvailableTodayOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'fee'>('rating');

  const isBangalore = selectedCity === 'Bangalore';

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedSpecialty && selectedSpecialty !== 'All Specialties') {
          queryParams.append('specialty', selectedSpecialty);
        }
        queryParams.append('city', selectedCity);
        if (searchQuery) {
          queryParams.append('query', searchQuery);
        }

        const res = await fetch(`/api/doctors?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setDoctors(Array.isArray(data.doctors) ? data.doctors : []);
        }
      } catch (err) {
        console.warn('Could not fetch from /api/doctors:', err);
      } finally {
        setLoading(false);
      }
    }

    void fetchDoctors();
  }, [selectedCity, selectedSpecialty, searchQuery]);

  const filteredDoctors = doctors
    .filter((doc) => {
      if (availableTodayOnly && !doc.availableToday) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
      return 0;
    });

  return (
    <section id="doctors" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/60 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-2">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Bangalore Doctor Network • Live</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isBangalore ? 'Find & Book Doctors in Bangalore' : `Doctors in ${selectedCity}`}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {isBangalore
                ? 'Verified medical specialists across Koramangala, Indiranagar, Whitefield, HSR Layout, Jayanagar & Malleshwaram.'
                : `Currently active in Bangalore. In-clinic doctors for ${selectedCity} are coming soon.`}
            </p>
          </div>

          <button
            onClick={() => openChat('Recommend an experienced doctor in Bangalore for my symptoms')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold transition-colors cursor-pointer self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Need a specialist recommendation? Ask AI</span>
          </button>
        </div>

        {/* If city is not Bangalore: Show "Working Soon" Card */}
        {!isBangalore ? (
          <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-4">
              <MapPinOff className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              Working Soon in {selectedCity}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-3">
              We are currently live with in-clinic doctors exclusively in Bangalore
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
              We are actively vetting and onboarding clinics in <strong>{selectedCity}</strong> and will be launching soon. In the meantime, you can consult verified Bangalore doctors via high-definition private <strong>Online Video Consultation</strong> from anywhere.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {onSwitchToBangalore && (
                <button
                  onClick={onSwitchToBangalore}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Switch to Bangalore Doctors</span>
                </button>
              )}

              <button
                onClick={() => openChat(`Can I consult a doctor online from ${selectedCity}?`)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Ask AI About Video Consults</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Specialty Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
              {SPECIALTIES.map((spec) => (
                <button
                  key={spec}
                  onClick={() => onSelectSpecialty(spec)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    selectedSpecialty === spec
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Sub-Filters and Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 text-xs sm:text-sm">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={availableTodayOnly}
                    onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700"
                  />
                  <span>Available Today</span>
                </label>
                <span className="text-slate-400 dark:text-slate-600">|</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Showing <strong>{filteredDoctors.length}</strong> verified Bangalore doctors
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'experience' | 'fee')}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="fee">Consultation Fee (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Doctors List */}
            {loading ? (
              <div className="py-16 text-center">
                <div className="inline-block w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading verified Bangalore doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No doctors match your criteria</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Try resetting your specialty filters or searching for general symptoms.
                </p>
                <button
                  onClick={() => {
                    onSelectSpecialty('All Specialties');
                    setAvailableTodayOnly(false);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-start gap-4">
                        <img
                          src={doctor.avatar}
                          alt={doctor.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                              {doctor.name}
                            </h3>
                            <span title="Verified Medical License">
                              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                            </span>
                          </div>

                          <p className="text-xs text-teal-700 dark:text-teal-400 font-medium mt-0.5">
                            {doctor.specialty} • {doctor.experienceYears} Years Exp.
                          </p>

                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {doctor.degree}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{doctor.rating}</span>
                              <span className="text-slate-500 dark:text-slate-400 font-normal">
                                ({doctor.reviewCount})
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[150px]">{doctor.hospital}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Doctor Location & Tags */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                          <span>{doctor.location}</span>
                        </div>

                        <div className="flex items-center gap-1 text-teal-700 dark:text-teal-400 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Next slot: {doctor.nextAvailableSlot}</span>
                        </div>
                      </div>

                      {/* Specialty Tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {doctor.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block leading-none">Consultation Fee</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                          ₹{doctor.consultationFee}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onBookDoctor(doctor, 'video')}
                          className="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Online Video</span>
                        </button>

                        <button
                          onClick={() => onBookDoctor(doctor, 'in-clinic')}
                          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Clinic Visit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
