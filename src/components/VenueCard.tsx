'use client'

import Link from "next/link";
import StarSolidIcon from "../../public/icons/star-solid";
import StarOutlineIcon from "../../public/icons/star-outline";
import { toggleObserveEvent } from "@/lib/users.actions";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Image from "next/image";
import AutoSlider from "./ui/autoslider";
import { Venue } from "@/types";

interface VenueCardProps {
  venue: Venue;
  userId?: string | null;
}

export default function VenueCard({ venue, userId }: VenueCardProps) {

        const [closeModal, setCloseModal] = useState(false)
        const [modalBgVis, setModalBgVis] = useState(false)

        const isEventObserved = venue.followers?.includes(userId || "")

        return (
          <Link href={`/venues/${venue.id}`}
            className={`relative w-full min-h-fit lg:min-h-[144px] rounded-lg shadow-md flex flex-col md:flex-row hover:shadow-lg hover:border-2 border-1 border-gray-900 transition-shadow`}
          >
            { (venue.imageUrls && venue.imageUrls?.length > 0) ? 
            ((venue.imageUrls && venue.imageUrls.length === 1) ?
              <div className="relative w-full lg:w-1/4"> {/* lub dowolne w/h */}
                <Image
                  src= {venue.imageUrls[0]}
                  alt={`Image $ venue.name}`}
                  fill
                  className="object-cover"
                />
              </div> :
              <AutoSlider imageUrls= {venue.imageUrls} altBase= {venue.name} />
            )
            :
              <div className={`w-full lg:w-1/4 flex flex-col justify-between items-center border-b-1 lg:border-b-0 lg:border-r-1 border-gray-400`}>
                <h2 className="text-xl font-semibold text-gray-800 mt-1 mx-auto text-center break-words w-full">{venue.name}</h2>
                <h2 className="text-gray-700 mx-auto text-xl font-semibold mt-4 lg:my-3">{venue.city}</h2>
                <p className="md:hidden text-gray-600 text-base mx-auto">{venue.address}</p>
              </div>    
            }

            <div className="w-full lg:w-3/5 flex flex-col justify-between items-start pl-2">
              {(venue.imageUrls && venue.imageUrls.length > 0) ? <>
              <h2 className="text-xl font-semibold text-gray-800 mt-1 mx-auto text-center break-words w-full">{venue.name}</h2>
              <div className="lg:h-6 my-2 ml-2 lg:ml-0">
                {venue.description && (
                  <div className="w-full text-gray-700 text-sm">
                    {venue.description.length > 100
                    ? venue.description.slice(0, 100) + "..."
                    : venue.description}
                  </div>
                )}
              </div>
              </>
              : <div className="lg:h-10 my-2 ml-2 lg:ml-0">
                  {venue.description && (
                    <div className="w-full text-gray-700 text-sm">
                      {venue.description.length > 200
                      ? venue.description.slice(0, 200) + "..."
                      : venue.description}
                    </div>
                  )}
                </div>}
              
              <div className="flex flex-wrap flex-row gap-2 my-2 ml-2 lg:ml-0">
                  {venue.sports && venue.sports.map((sport, index) => (
                    <span key={index} className="bg-gray-700 text-white px-2 py-1 rounded-full text-sm">
                      {sport}
                    </span>
                  ))}
              </div>
              <h2>{venue.accessibility}</h2>
              <div className="hidden lg:flex flex-wrap gap-2 mt-2 ml-2 lg:ml-0 mb-3">
                {(venue.imageUrls && venue.imageUrls.length > 0) && 
                <p className="text-gray-700 text-base font-semibold">{venue.city}</p>}
                <p className=" text-gray-600 text-base">{venue.address}</p>
              </div>
            </div>

                <div className="absolute top-0 right-0 p-1 flex flex-row"
                  onClick={async (e) => {
                      e.preventDefault();     
                      e.stopPropagation();     
                      await toggleObserveEvent({ eventId: venue.id });
                    }}>
                  {isEventObserved ? <div className="text-pink-500 hover:text-pink-800"><StarSolidIcon/></div> : <div className="hover:text-pink-500"><StarOutlineIcon/></div>}
                </div>
              {!closeModal && 
                <div className={`absolute bottom-0 right-0 p-1 text-xs text-gray-700 flex flex-col ${modalBgVis ? 'bg-gray-100 rounded-lg' : ""} `}>
                  <button
                    onClick={(e)=> {
                      e.preventDefault();
                      e.stopPropagation();
                      setCloseModal(!closeModal)}}
                    onMouseEnter={() => setModalBgVis(true)}
                    onMouseLeave={() => setModalBgVis(false)}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer ml-auto mr-1 mb-2"
                    aria-label="Zamknij"
                    >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                  {venue.organizator && <p className="">zarządzający: <span className="font-medium">{venue.organizator}</span></p>}
                  {venue.contact_email && <p className="">email: <span className="font-medium">{venue.contact_email}</span></p>}
                  {venue.contact_phone && <p className="">telefon: <span className="font-medium">{venue.contact_phone}</span></p>}

                  <p>Dodane przez: <span className="font-medium">{venue.creator_name}</span></p>
                </div>}
          </Link>
        )
  }