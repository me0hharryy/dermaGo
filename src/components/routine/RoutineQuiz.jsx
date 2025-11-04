import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/solid';

// --- Reusable Form Components ---

// A. Text/Number Input
const FormInput = ({ id, label, type = 'text', register, rules, errors, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      {...register(id, rules)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
    />
    {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
  </div>
);

// B. Select Input
const FormSelect = ({ id, label, register, rules, errors, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select
      id={id}
      {...register(id, rules)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
    >
      {children}
    </select>
    {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
  </div>
);

// C. Re-designed: Radio/Checkbox Card Input
const InputOption = ({ name, type, label, value, register, rules }) => (
  <label className="relative block cursor-pointer">
    {/* The hidden native input */}
    <input 
      type={type} 
      value={value || label} 
      {...register(name, rules)} 
      className="peer sr-only" // This hides the ugly default input
    />
    
    {/* This is the custom visual card */}
    <div className="p-4 border border-gray-300 rounded-lg bg-white text-gray-700
                    text-sm font-medium
                    hover:border-cyan-500
                    peer-checked:border-cyan-600 peer-checked:bg-cyan-50 peer-checked:text-cyan-900
                    transition-all duration-200">
      {label}
    </div>

    {/* A checkmark icon that appears when selected */}
    <div className="absolute top-1/2 -translate-y-1/2 right-4 text-cyan-600
                    opacity-0 peer-checked:opacity-100 
                    transition-opacity duration-200">
      <CheckIcon className="w-5 h-5" />
    </div>
  </label>
);

// D. New: Section Component
const FormSection = ({ title, subtitle, children }) => (
  <div className="animate-fadeIn">
    <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-6">{subtitle}</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

// E. New: Progress Bar
const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div 
        className="bg-cyan-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};


// --- The Main Quiz Component ---

export default function RoutineQuiz({ onQuizSubmit }) {
  const { register, handleSubmit, formState: { errors }, trigger } = useForm({
    mode: 'onTouched' // Show errors as user interacts
  });
  const [currentStep, setCurrentStep] = useState(0);

  // Define the steps and their fields for validation
  const steps = [
    { 
      id: 'basics', 
      title: 'Let\'s start with the basics.',
      subtitle: 'This helps us understand your skin profile.',
      fields: ['age'] // 'gender' is optional
    },
    { 
      id: 'skin', 
      title: 'Tell us about your skin.',
      subtitle: 'Select all that apply.',
      fields: ['skinType'] // 'concerns' is optional
    },
    { 
      id: 'lifestyle', 
      title: 'Lifestyle & Habits',
      subtitle: 'These factors make a big difference.',
      fields: ['sunlight', 'sunscreen', 'water', 'exercise'] 
    },
    { 
      id: 'routine', 
      title: 'Your Current Routine',
      subtitle: 'What are you currently doing?',
      fields: ['faceWash', 'moisturizer', 'exfoliate', 'makeup'] 
    },
    { 
      id: 'medical', 
      title: 'Almost done!',
      subtitle: 'Any medical info we should know?',
      fields: [] // All optional
    }
  ];

  // --- Navigation Functions ---
  
  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields); // Validate only current step's fields
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(s => s + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(s => s - 1);
  };

  // This is the final submit
  const onSubmit = (data) => {
    onQuizSubmit(data);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Build Your AI Routine</h2>
      <p className="text-center text-gray-600 mb-8">
        Step {currentStep + 1} of {steps.length}
      </p>

      {/* Progress Bar */}
      <ProgressBar current={currentStep + 1} total={steps.length} />

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Step 1: Basic Info */}
        {steps[currentStep].id === 'basics' && (
          <FormSection 
            title={steps[currentStep].title}
            subtitle={steps[currentStep].subtitle}
          >
            <FormSelect 
              id="gender" 
              label="Gender" 
              register={register} 
              errors={errors} // <-- BUG FIX #1
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </FormSelect>
            <FormInput 
              id="age" 
              label="Age" 
              type="number"
              register={register} 
              rules={{ 
                required: 'Age is required',
                min: { value: 13, message: 'Must be at least 13' },
                max: { value: 100, message: 'Must be 100 or younger' }
              }}
              errors={errors}
            />
          </FormSection>
        )}

        {/* Step 2: Skin Type & Concerns */}
        {steps[currentStep].id === 'skin' && (
          <>
            <FormSection 
              title={steps[currentStep].title}
              subtitle={steps[currentStep].subtitle}
            >
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Skin Type (choose one or more)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <InputOption name="skinType" type="checkbox" label="Oily" register={register} rules={{ required: "Please select at least one skin type" }} />
                  <InputOption name="skinType" type="checkbox" label="Dry" register={register} rules={{ required: "Please select at least one skin type" }} />
                  <InputOption name="skinType" type="checkbox" label="Normal" register={register} rules={{ required: "Please select at least one skin type" }} />
                  <InputOption name="skinType" type="checkbox" label="Combination" register={register} rules={{ required: "Please select at least one skin type" }} />
                  <InputOption name="skinType" type="checkbox" label="Sensitive" register={register} rules={{ required: "Please select at least one skin type" }} />
                  <InputOption name="skinType" type="checkbox" label="Acne-prone" register={register} rules={{ required: "Please select at least one skin type" }} />
                </div>
                {errors.skinType && <p className="text-red-500 text-sm mt-2">{errors.skinType.message}</p>}
              </div>

              <div className="md:col-span-2 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Skin Concerns (optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <InputOption name="concerns" type="checkbox" label="Acne / Pimples" register={register} />
                  <InputOption name="concerns" type="checkbox" label="Blackheads" register={register} />
                  <InputOption name="concerns" type="checkbox" label="Dullness" register={register} />
                  <InputOption name="concerns" type="checkbox" label="Pigmentation" register={register} />
                  <InputOption name="concerns" type="checkbox" label="Redness" register={register} />
                  <InputOption name="concerns" type="checkbox" label="Dry patches" register={register} /> {/* <-- BUG FIX #2 */}
                  <InputOption name="concerns" type="checkbox" label="Fine lines" register={register} />
                </div>
              </div>
            </FormSection>
          </>
        )}
        
        {/* Step 3: Lifestyle */}
        {steps[currentStep].id === 'lifestyle' && (
          <FormSection 
            title={steps[currentStep].title}
            subtitle={steps[currentStep].subtitle}
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">How many hours are you exposed to sunlight daily?</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <InputOption name="sunlight" type="radio" value="< 1 hour" label="< 1 hour" register={register} rules={{ required: "Please select an option" }} />
                <InputOption name="sunlight" type="radio" value="1-3 hours" label="1-3 hours" register={register} rules={{ required: "Please select an option" }} />
                <InputOption name="sunlight" type="radio" value="3-6 hours" label="3-6 hours" register={register} rules={{ required: "Please select an option" }} />
                <InputOption name="sunlight" type="radio" value="> 6 hours" label="> 6 hours" register={register} rules={{ required: "Please select an option" }} />
              </div>
              {errors.sunlight && <p className="text-red-500 text-sm mt-2">{errors.sunlight.message}</p>}
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you regularly wear sunscreen?</label>
                <div className="grid grid-cols-2 gap-2">
                  <InputOption name="sunscreen" type="radio" value="Yes" label="Yes" register={register} rules={{ required: "Please select an option" }} />
                  <InputOption name="sunscreen" type="radio" value="No" label="No" register={register} rules={{ required: "Please select an option" }} />
                </div>
                {errors.sunscreen && <p className="text-red-500 text-sm mt-2">{errors.sunscreen.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How much water do you drink daily?</label>
                <div className="grid grid-cols-2 gap-2">
                  <InputOption name="water" type="radio" value="< 1L" label="< 1L" register={register} rules={{ required: "Please select an option" }} />
                  <InputOption name="water" type="radio" value="1-2L" label="1-2L" register={register} rules={{ required: "Please select an option" }} />
                  <InputOption name="water" type="radio" value="> 2L" label="> 2L" register={register} rules={{ required: "Please select an option" }} />
                </div>
                {errors.water && <p className="text-red-500 text-sm mt-2">{errors.water.message}</p>}
              </div>
            </div>
             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">How often do you exercise or sweat heavily?</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <InputOption name="exercise" type="radio" value="Rarely" label="Rarely" register={register} rules={{ required: "Please select an option" }} />
                <InputOption name="exercise" type="radio" value="2-3 times a week" label="2-3 times/week" register={register} rules={{ required: "Please select an option" }} />
                <InputOption name="exercise" type="radio" value="Daily" label="Daily" register={register} rules={{ required: "Please select an option" }} />
              </div>
              {errors.exercise && <p className="text-red-500 text-sm mt-2">{errors.exercise.message}</p>}
            </div>
          </FormSection>
        )}

        {/* Step 4: Current Routine */}
        {steps[currentStep].id === 'routine' && (
          <FormSection 
            title={steps[currentStep].title}
            subtitle={steps[currentStep].subtitle}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How often do you wash your face?</label>
              <InputOption name="faceWash" type="radio" value="Once a day" label="Once a day" register={register} rules={{ required: "Please select an option" }} />
              <InputOption name="faceWash" type="radio" value="Twice a day" label="Twice a day" register={register} rules={{ required: "Please select an option" }} />
              <InputOption name="faceWash" type="radio" value="More than twice" label="More than twice" register={register} rules={{ required: "Please select an option" }} />
              {errors.faceWash && <p className="text-red-500 text-sm mt-2">{errors.faceWash.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you use moisturizer?</label>
              <InputOption name="moisturizer" type="radio" value="Yes" label="Yes" register={register} rules={{ required: "Please select an option" }} />
              <InputOption name="moisturizer" type="radio" value="No" label="No" register={register} rules={{ required: "Please select an option" }} />
              {errors.moisturizer && <p className="text-red-500 text-sm mt-2">{errors.moisturizer.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you exfoliate?</label>
              <InputOption name="exfoliate" type="radio" value="Weekly" label="Weekly" register={register} rules={{ required: "Please select an option" }} />
              <InputOption name="exfoliate" type="radio" value="Rarely" label="Rarely" register={register} rules={{ required: "Please select an option" }} />
              <InputOption name="exfoliate" type="radio" value="Never" label="Never" register={register} rules={{ required: "Please select an option" }} />
              {errors.exfoliate && <p className="text-red-500 text-sm mt-2">{errors.exfoliate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you use makeup daily?</label>
              <InputOption name="makeup" type="radio" value="Yes" label="Yes" register={register} rules={{ required: "Please select an option" }} />
              <InputOption name="makeup" type="radio" value="No" label="No" register={register} rules={{ required: "Please select an option" }} />
              {errors.makeup && <p className="text-red-500 text-sm mt-2">{errors.makeup.message}</p>}
            </div>
          </FormSection>
        )}

        {/* Step 5: Medical Background */}
        {steps[currentStep].id === 'medical' && (
          <FormSection 
            title={steps[currentStep].title}
            subtitle={steps[currentStep].subtitle}
          >
            <div className="md:col-span-2">
              <FormInput 
                id="allergies"
                label="Any known allergies or skin reactions? (Optional)"
                register={register}
                errors={errors}
                placeholder="e.g., fragrance, specific acids"
              />
            </div>
            <div className="md:col-span-2">
              <FormInput 
                id="medication"
                label="Are you under any medication? (Optional)"
                register={register}
                errors={errors}
                placeholder="e.g., acne medication, etc."
              />
            </div>
          </FormSection>
        )}

        {/* --- Navigation Buttons --- */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
          <div>
            {currentStep > 0 && (
              <button 
                type="button"
                onClick={handleBack}
                className="flex items-center bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back
              </button>
            )}
          </div>
          
          <div>
            {currentStep < steps.length - 1 && (
              <button 
                type="button"
                onClick={handleNext}
                className="flex items-center bg-cyan-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
              >
                Next
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            )}
            
            {currentStep === steps.length - 1 && (
              <button 
                type="submit"
                className="bg-cyan-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-cyan-700 transition-colors"
              >
                Generate My Routine
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}